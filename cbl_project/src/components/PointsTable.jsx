var POINTS_DATA = [
  { rank: 1, team: 'Thunder Boys', played: 8, won: 6, lost: 2, points: 18 },
  { rank: 2, team: 'Smash Masters', played: 8, won: 5, lost: 3, points: 15 },
  { rank: 3, team: 'Smart Boys', played: 8, won: 4, lost: 4, points: 12 },
];

export default function PointsTable() {
  return (
    <>
      {/* Desktop table */}
      <div className="points_table_wrap">
        <table className="points_table">
          <thead>
            <tr>
              <th>#</th>
              <th>Team</th>
              <th>Played</th>
              <th>Won</th>
              <th>Lost</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {POINTS_DATA.map(function (row) {
              return (
                <tr key={row.team}>
                  <td className="rank">{row.rank}</td>
                  <td className="team_col">{row.team}</td>
                  <td>{row.played}</td>
                  <td>{row.won}</td>
                  <td>{row.lost}</td>
                  <td className="points_col">{row.points}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile card layout */}
      <div className="points_cards_mobile">
        {POINTS_DATA.map(function (row) {
          return (
            <div key={row.team} className="points_card_mobile">
              <div className="points_card_mobile_header">
                <div>
                  <span className="points_card_mobile_rank">#{row.rank} </span>
                  <span className="points_card_mobile_team">{row.team}</span>
                </div>
                <div className="points_card_mobile_pts">{row.points} pts</div>
              </div>
              <div className="points_card_mobile_stats">
                <div className="points_card_mobile_stat">
                  <span className="points_card_mobile_stat_label">Played</span>
                  <span className="points_card_mobile_stat_value">{row.played}</span>
                </div>
                <div className="points_card_mobile_stat">
                  <span className="points_card_mobile_stat_label">Won</span>
                  <span className="points_card_mobile_stat_value">{row.won}</span>
                </div>
                <div className="points_card_mobile_stat">
                  <span className="points_card_mobile_stat_label">Lost</span>
                  <span className="points_card_mobile_stat_value">{row.lost}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
