var POINTS_DATA = [
  {
    rank: 1,
    team: 'Smash Masters',
    image: '/images/smash_masters.png',
    mp: 18,
    w: 13,
    l: 5,
    tp: 26,
  },
  {
    rank: 2,
    team: 'Thunder Boys',
    image: '/images/thunder_boys.png',
    mp: 18,
    w: 13,
    l: 5,
    tp: 26,
  },
  {
    rank: 3,
    team: 'Smart Boys',
    image: '/images/smart_boys.png',
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

export default function PointsTable() {
  return (
    <div className="cbl_points_shell">
      <h2 className="cbl_points_title">🏆 CBL Points Table</h2>
      <p className="cbl_points_subtitle">League standings — compact view, full team names.</p>

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

        {POINTS_DATA.map(function (row) {
          var place_class = 'cbl_points_row--p' + row.rank;
          return (
            <div
              key={row.team}
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
  );
}
