import { useState, useEffect } from 'react';

var TEAM_CLASS_MAP = {
  'Thunder Boys': 'team_thunder',
  'Smash Masters': 'team_smash',
  'Smart Boys': 'team_smart',
};

export default function PlayerCard({ player, on_profile_click }) {
  var team_class = player ? TEAM_CLASS_MAP[player.team] || '' : '';
  var name = player ? player.name : '';
  var team = player ? player.team : '';
  var role = player ? player.role : '';
  var nickname = player ? player.nickname : '';
  var [use_placeholder, set_use_placeholder] = useState(false);

  useEffect(function () {
    set_use_placeholder(false);
  }, [player]);

  function handle_click() {
    if (!player || !on_profile_click) return;
    on_profile_click(player);
  }

  var img_src = player && (use_placeholder && player.placeholder_image ? player.placeholder_image : player.image);

  return (
    <div className={'player_card ' + team_class} onClick={handle_click} role="button" tabIndex={0} onKeyDown={function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handle_click(); } }} aria-label={'View profile of ' + name}>
      <div className="player_avatar">
        {player && player.image ? (
          <img
            src={img_src}
            alt={name}
            onError={function () {
              if (player.placeholder_image) set_use_placeholder(true);
            }}
          />
        ) : (
          '🏸'
        )}
      </div>
      <div className="player_name">{name}</div>
      {nickname ? <div className="player_nickname_tag">{nickname}</div> : null}
      <div className="player_info_label">Team</div>
      <div className="player_info_value">{team}</div>
      <div className="player_info_label">Role</div>
      <div className="player_info_value">{role}</div>
      <div className="player_btns">
        <button type="button" className="btn_card btn_card_outline">See profile</button>
        <button type="button" className="btn_card btn_card_fill">Choose</button>
      </div>
    </div>
  );
}
