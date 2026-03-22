import { useState, useEffect, useRef } from 'react';
import { public_asset_url } from '../public_asset_url.js';
import { api_url } from '../api_base.js';

function team_image_for_name(team_name) {
  var map = {
    'Smash Masters': 'images/smash_masters.png',
    'Thunder Boys': 'images/thunder_boys.png',
    'Smart Boys': 'images/smart_boys.png',
  };
  return public_asset_url(map[team_name] || 'images/thunder_boys.png');
}

var POINTS_FALLBACK = [
  {
    id: null,
    rank: 1,
    team: 'Smash Masters',
    image: team_image_for_name('Smash Masters'),
    mp: 18,
    w: 13,
    l: 5,
    tp: 26,
  },
  {
    id: null,
    rank: 2,
    team: 'Thunder Boys',
    image: team_image_for_name('Thunder Boys'),
    mp: 18,
    w: 13,
    l: 5,
    tp: 26,
  },
  {
    id: null,
    rank: 3,
    team: 'Smart Boys',
    image: team_image_for_name('Smart Boys'),
    mp: 18,
    w: 1,
    l: 17,
    tp: 2,
  },
];

function medal_for_rank(rank) {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return '';
}

/** Shown when /api/teams fails (local = no backend; live = no VITE_API_URL or API down). */
function api_fallback_help_text() {
  if (import.meta.env.DEV) {
    return 'Showing offline data (API unreachable). In a second terminal run: npm run server';
  }
  return (
    'Showing offline data. For production, deploy the Express API (e.g. Render/Railway), set env VITE_API_URL to that API base URL in your frontend host (e.g. Vercel), then redeploy.'
  );
}

function normalize_rows_from_api(rows) {
  return rows.map(function (row) {
    return {
      id: row._id != null ? String(row._id) : null,
      rank: row.rank,
      team: row.team,
      image: team_image_for_name(row.team),
      mp: row.mp,
      w: row.w,
      l: row.l,
      tp: row.tp,
    };
  });
}

export default function PointsTable() {
  var [rows, set_rows] = useState(null);
  var [load_error, set_load_error] = useState(null);
  var [using_fallback, set_using_fallback] = useState(false);
  var [edit_open, set_edit_open] = useState(false);
  var [edit_draft, set_edit_draft] = useState([]);
  var [saving_index, set_saving_index] = useState(null);
  var [save_message, set_save_message] = useState(null);

  var tap_count_ref = useRef(0);
  var tap_timer_ref = useRef(null);

  useEffect(function () {
    var cancelled = false;
    set_load_error(null);

    fetch(api_url('/api/teams'))
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        if (cancelled) return;
        if (!Array.isArray(data) || data.length === 0) {
          set_rows(POINTS_FALLBACK);
          set_using_fallback(true);
          return;
        }
        set_rows(normalize_rows_from_api(data));
        set_using_fallback(false);
      })
      .catch(function (err) {
        if (cancelled) return;
        console.warn('PointsTable API:', err);
        set_load_error(String(err && err.message ? err.message : err));
        set_rows(POINTS_FALLBACK);
        set_using_fallback(true);
      });

    return function () {
      cancelled = true;
    };
  }, []);

  useEffect(function () {
    return function () {
      if (tap_timer_ref.current) {
        clearTimeout(tap_timer_ref.current);
      }
    };
  }, []);

  useEffect(function () {
    if (!edit_open) {
      return undefined;
    }
    var prev_overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return function () {
      document.body.style.overflow = prev_overflow;
    };
  }, [edit_open]);

  function handle_secret_tap() {
    if (rows === null || rows.length === 0) {
      return;
    }
    tap_count_ref.current += 1;
    if (tap_count_ref.current >= 3) {
      tap_count_ref.current = 0;
      if (tap_timer_ref.current) {
        clearTimeout(tap_timer_ref.current);
        tap_timer_ref.current = null;
      }
      set_edit_draft(
        rows.map(function (r) {
          return {
            id: r.id,
            team: r.team,
            mp: r.mp,
            w: r.w,
            l: r.l,
            tp: r.tp,
          };
        })
      );
      set_save_message(null);
      set_edit_open(true);
      return;
    }
    if (tap_timer_ref.current) {
      clearTimeout(tap_timer_ref.current);
    }
    tap_timer_ref.current = setTimeout(function () {
      tap_count_ref.current = 0;
      tap_timer_ref.current = null;
    }, 650);
  }

  function close_edit() {
    set_edit_open(false);
    set_save_message(null);
    set_saving_index(null);
  }

  function update_draft_field(index, field, raw_value) {
    var n = raw_value === '' ? 0 : Number(raw_value);
    if (Number.isNaN(n)) {
      n = 0;
    }
    set_edit_draft(function (prev) {
      var next = prev.slice();
      var row = { ...next[index] };
      row[field] = n;
      next[index] = row;
      return next;
    });
  }

  function save_row(index) {
    var row = edit_draft[index];
    if (!row || !row.id) {
      set_save_message('Cannot save: run the API (npm run server) and load data from MongoDB.');
      return;
    }
    set_saving_index(index);
    set_save_message(null);
    fetch(api_url('/api/teams/' + row.id), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: row.team,
        mp: row.mp,
        w: row.w,
        l: row.l,
        tp: row.tp,
      }),
    })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function () {
        return fetch(api_url('/api/teams'));
      })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        if (!Array.isArray(data) || data.length === 0) {
          set_rows(POINTS_FALLBACK);
          set_using_fallback(true);
        } else {
          var normalized = normalize_rows_from_api(data);
          set_rows(normalized);
          set_using_fallback(false);
          set_edit_draft(
            normalized.map(function (r) {
              return {
                id: r.id,
                team: r.team,
                mp: r.mp,
                w: r.w,
                l: r.l,
                tp: r.tp,
              };
            })
          );
        }
        set_saving_index(null);
        set_save_message('Saved ' + row.team + '.');
      })
      .catch(function (err) {
        set_saving_index(null);
        set_save_message(String(err && err.message ? err.message : err));
      });
  }

  var display_rows = rows !== null ? rows : [];
  var show_loading = rows === null && load_error === null;

  return (
    <>
      <div className="cbl_points_shell" onClick={handle_secret_tap} role="presentation">
        <h2 className="cbl_points_title" title="Triple-tap this block to edit standings (admin)">
          🏆 CBL Points Table
        </h2>
        <p className="cbl_points_subtitle">League standings — compact view, full team names.</p>

        {using_fallback ? (
          <p className="cbl_points_api_note" role="status">
            {load_error ? api_fallback_help_text() : 'Showing default data.'}
          </p>
        ) : null}

        {show_loading ? (
          <p className="cbl_points_api_note">Loading standings…</p>
        ) : null}

        <div className="cbl_points_glass">
          <div className="cbl_points_grid cbl_points_grid--head" role="row">
            <div className="cbl_points_cell cbl_points_cell--rank" role="columnheader">
              <span className="cbl_points_th_inner">Rank</span>
            </div>
            <div className="cbl_points_cell cbl_points_cell--team" role="columnheader">
              <span className="cbl_points_th_inner">Team</span>
            </div>
            <div className="cbl_points_cell cbl_points_cell--stat" role="columnheader">
              <abbr title="Matches Played">MP</abbr>
            </div>
            <div className="cbl_points_cell cbl_points_cell--stat" role="columnheader">
              <abbr title="Wins">W</abbr>
            </div>
            <div className="cbl_points_cell cbl_points_cell--stat" role="columnheader">
              <abbr title="Losses">L</abbr>
            </div>
            <div className="cbl_points_cell cbl_points_cell--stat" role="columnheader">
              <abbr title="Total Points">TP</abbr>
            </div>
          </div>

          {display_rows.map(function (row) {
            var place_class = 'cbl_points_row--p' + row.rank;
            return (
              <div
                key={(row.id || '') + row.team}
                className={'cbl_points_grid cbl_points_row ' + place_class}
                role="row"
              >
                <div className="cbl_points_cell cbl_points_cell--rank" role="cell">
                  <span className="cbl_points_medal" aria-hidden="true">{medal_for_rank(row.rank)}</span>
                  <span className="cbl_points_rank_num">#{row.rank}</span>
                </div>
                <div className="cbl_points_cell cbl_points_cell--team" role="cell">
                  <div className="cbl_points_team_stack">
                    <img
                      className="cbl_points_team_img"
                      src={row.image}
                      alt=""
                      width="40"
                      height="40"
                      loading="lazy"
                    />
                    <span className="cbl_points_team_name">{row.team}</span>
                  </div>
                </div>
                <div className="cbl_points_cell cbl_points_cell--stat" role="cell">
                  <span className="cbl_points_stat_val">{row.mp}</span>
                </div>
                <div className="cbl_points_cell cbl_points_cell--stat" role="cell">
                  <span className="cbl_points_stat_val">{row.w}</span>
                </div>
                <div className="cbl_points_cell cbl_points_cell--stat" role="cell">
                  <span className="cbl_points_stat_val">{row.l}</span>
                </div>
                <div className="cbl_points_cell cbl_points_cell--stat" role="cell">
                  <span className="cbl_points_stat_val cbl_points_stat_val--tp">{row.tp}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {edit_open ? (
        <div
          className="points_edit_overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="points_edit_title"
          onClick={function (e) {
            if (e.target === e.currentTarget) {
              close_edit();
            }
          }}
        >
          <div className="points_edit_panel" onClick={function (e) { e.stopPropagation(); }}>
            <button type="button" className="points_edit_close" onClick={close_edit} aria-label="Close">
              ×
            </button>
            <h3 id="points_edit_title" className="points_edit_title">
              Edit standings
            </h3>
            <p className="points_edit_hint">Triple-tap the table block to open this screen. Save sends updates to MongoDB (API must be running).</p>
            {save_message ? <p className="points_edit_msg">{save_message}</p> : null}
            <div className="points_edit_list">
              {edit_draft.map(function (row, index) {
                return (
                  <div key={(row.id || '') + row.team} className="points_edit_card">
                    <div className="points_edit_team_label">{row.team}</div>
                    <div className="points_edit_fields">
                      <label className="points_edit_field">
                        <span>MP</span>
                        <input
                          type="number"
                          min="0"
                          className="points_edit_input"
                          value={row.mp}
                          onChange={function (e) {
                            update_draft_field(index, 'mp', e.target.value);
                          }}
                        />
                      </label>
                      <label className="points_edit_field">
                        <span>W</span>
                        <input
                          type="number"
                          min="0"
                          className="points_edit_input"
                          value={row.w}
                          onChange={function (e) {
                            update_draft_field(index, 'w', e.target.value);
                          }}
                        />
                      </label>
                      <label className="points_edit_field">
                        <span>L</span>
                        <input
                          type="number"
                          min="0"
                          className="points_edit_input"
                          value={row.l}
                          onChange={function (e) {
                            update_draft_field(index, 'l', e.target.value);
                          }}
                        />
                      </label>
                      <label className="points_edit_field">
                        <span>TP</span>
                        <input
                          type="number"
                          min="0"
                          className="points_edit_input"
                          value={row.tp}
                          onChange={function (e) {
                            update_draft_field(index, 'tp', e.target.value);
                          }}
                        />
                      </label>
                    </div>
                    <button
                      type="button"
                      className="points_edit_save_btn"
                      disabled={saving_index !== null}
                      onClick={function () {
                        save_row(index);
                      }}
                    >
                      {saving_index === index ? 'Saving…' : 'Save row'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
