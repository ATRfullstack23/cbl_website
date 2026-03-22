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
  var [photo_step, set_photo_step] = useState(0);

  useEffect(function () {
    set_photo_step(0);
  }, [player]);

  function handle_click() {
    if (!player || !on_profile_click) return;
    on_profile_click(player);
  }

  /** Card avatar: only local profile PNGs — never ui-avatars (placeholder) here */
  function get_card_image_src() {
    if (!player) return '';
    if (photo_step === 1) return player.image || '';
    return player.profile_photo || player.image || '';
  }

  function handle_img_error() {
    if (!player) return;
    if (photo_step === 0 && player.profile_photo && player.image && player.profile_photo !== player.image) {
      set_photo_step(1);
      return;
    }
    set_photo_step(2);
  }

  var img_src = get_card_image_src();
  var show_avatar_img = player && photo_step < 2 && img_src;

  return (
    <div className={'player_card ' + team_class} onClick={handle_click} role="button" tabIndex={0} onKeyDown={function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handle_click(); } }} aria-label={'View profile of ' + name}>
      <div className={'player_avatar' + (player && player.profile_photo ? ' player_avatar--profile' : '')}>
        {(show_avatar_img)}

          <img
            src={img_src}
            alt={name}
            onError={handle_img_error}
          />
      </div>
      <div className="player_name">{name}</div>
      {nickname ? <div className="player_nickname_tag">{nickname}</div> : null}
      <div className="player_info_label">Team</div>
      <div className="player_info_value">{team}</div>
      <div className="player_info_label">Role</div>
      <div className="player_info_value">{role}</div>
      <div className="player_btns player_btns--single">
        <button type="button" className="btn_card btn_card_outline">See profile</button>
      </div>
    </div>
  );
}
