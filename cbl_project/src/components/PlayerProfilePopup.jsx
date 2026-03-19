import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

var ICON_LABELS = {
  shield: '🛡️',
  explosion: '💥',
  tactics: '⚙️',
  lightning: '⚡',
  gauge: '🎯',
  playmaker: '🎩',
  star: '⭐',
  target: '🎯',
};

function SkillIcon({ icon_key }) {
  var char = ICON_LABELS[icon_key] || ICON_LABELS.star;
  return <div className="profile_popup_badge">{char}</div>;
}

function StatBar({ label, value, color }) {
  return (
    <div className="profile_popup_stat_row">
      <span className="profile_popup_stat_label">{label}</span>
      <div className="profile_popup_stat_track">
        <div className="profile_popup_stat_fill" style={{ width: value + '%', background: color }} />
      </div>
      <span className="profile_popup_stat_value">{value}</span>
    </div>
  );
}

export default function PlayerProfilePopup({ player, on_close }) {
  useEffect(function () {
    function handle_key(e) {
      if (e.key === 'Escape') on_close();
    }
    document.addEventListener('keydown', handle_key);
    document.body.style.overflow = 'hidden';
    return function () {
      document.removeEventListener('keydown', handle_key);
      document.body.style.overflow = '';
    };
  }, [on_close]);

  if (!player) return null;

  var stats = player.stats || {};
  var stat_keys = Object.keys(stats);
  var primary = player.theme_primary || '#c084fc';
  var accent = player.theme_accent || '#e879f9';
  var [image_error, set_image_error] = useState(false);

  useEffect(function () {
    set_image_error(false);
  }, [player]);

  var popup_img_src = image_error && player.placeholder_image ? player.placeholder_image : player.image;

  var content = (
    <div className="profile_popup_overlay" onClick={on_close} role="dialog" aria-modal="true" aria-labelledby="profile_popup_title">
      <div className="profile_popup_card" onClick={function (e) { e.stopPropagation(); }} style={{ '--profile-primary': primary, '--profile-accent': accent }}>
        <button type="button" className="profile_popup_close" onClick={on_close} aria-label="Close">×</button>

        <div className="profile_popup_frame">
          <div className="profile_popup_art" style={{ background: 'linear-gradient(160deg, ' + primary + ' 0%, ' + (player.theme_accent || '#1a1a2e') + ' 70%)' }}>
            <div className="profile_popup_halftone" aria-hidden="true" />
            <span className="profile_popup_name" id="profile_popup_title">{player.name.toUpperCase()}</span>
            {player.image ? (
              <img
                src={popup_img_src}
                alt=""
                className="profile_popup_avatar_img"
                onError={function () { set_image_error(true); }}
              />
            ) : null}
            {!player.image ? <div className="profile_popup_avatar">🏸</div> : null}
            <SkillIcon icon_key={player.icon} />
          </div>
          <div className="profile_popup_footer">
            <span className="profile_popup_nickname">{player.nickname}</span>
          </div>
        </div>

        <div className="profile_popup_details">
          <p className="profile_popup_team">{player.team} · {player.role}</p>
          <p className="profile_popup_skill_desc">{player.skill_desc}</p>
          <div className="profile_popup_stats">
            {stat_keys.map(function (key) {
              var label = key.replace(/_/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
              return <StatBar key={key} label={label} value={stats[key]} color={primary} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
