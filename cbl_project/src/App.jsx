import { useState } from 'react';
import { public_asset_url } from './public_asset_url.js';
import Nav from './components/Nav.jsx';
import TeamCarousel from './components/TeamCarousel.jsx';
import PlayerCardsSlider from './components/PlayerCardsSlider.jsx';
import PlayerProfilePopup from './components/PlayerProfilePopup.jsx';
import PointsTable from './components/PointsTable.jsx';
import Footer from './components/Footer.jsx';
import use_scroll_reveal from './hooks/use_scroll_reveal.js';

function player_placeholder_url(name, hex_color) {
  var color = (hex_color || '7c3aed').replace('#', '');
  return 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name) + '&size=400&background=' + color + '&color=fff';
}

function player_profile_png(slug) {
  return public_asset_url('/images/players/' + slug + '.png');

}

var PLAYERS = [
  { name: 'Elby', team: 'Thunder Boys', role: 'Doubles', nickname: 'THE WALL', skill_type: 'Defense', skill_desc: 'Immovable at the net. Blocks and lifts turn into counter-attacks.', theme_primary: '#6a0dad', theme_accent: '#ffd700', stats: { smash_power: 72, defense: 99, agility: 78, strategy: 85, stamina: 88 }, icon: 'shield', profile_photo: player_profile_png('elby'), image: player_profile_png('elby'), placeholder_image: player_placeholder_url('Elby', '6a0dad'), comic_card_art: true },
  { name: 'Amaldev', team: 'Thunder Boys', role: 'Doubles', nickname: 'THE STRATEGIST', skill_type: 'Strategy', skill_desc: 'Reads the game like a chess master. Drops and placement win points.', theme_primary: '#00897b', theme_accent: '#00e5ff', stats: { smash_power: 75, defense: 82, agility: 80, strategy: 97, stamina: 78 }, icon: 'tactics', profile_photo: player_profile_png('amaldev'), image: player_profile_png('amaldev'), placeholder_image: player_placeholder_url('Amaldev', '00897b'), comic_card_art: true },
  { name: 'Amal', team: 'Smart Boys', role: 'Doubles', nickname: 'THE POWERHOUSE', skill_type: 'Power', skill_desc: 'Devastating smashes and explosive jumps. Opponents fear the kill shot.', theme_primary: '#e65100', theme_accent: '#ffeb3b', stats: { smash_power: 98, defense: 70, agility: 82, strategy: 68, stamina: 85 }, icon: 'explosion', profile_photo: player_profile_png('amal'), image: player_profile_png('amal'), placeholder_image: player_placeholder_url('Amal', 'e65100'), comic_card_art: true },
  { name: 'Sanjay', team: 'Smart Boys', role: 'Doubles', nickname: 'THE PLAYMAKER', skill_type: 'Playmaking', skill_desc: 'Sets up partners and creates openings. The court conductor.', theme_primary: '#ff8f00', theme_accent: '#ffd54f', stats: { smash_power: 72, defense: 78, agility: 85, strategy: 92, stamina: 80 }, icon: 'playmaker', profile_photo: player_profile_png('sanjay'), image: player_profile_png('sanjay'), placeholder_image: player_placeholder_url('Sanjay', 'ff8f00'), comic_card_art: true },
  { name: 'Arun', team: 'Smash Masters', role: 'Doubles', nickname: 'THE ENGINE', skill_type: 'Stamina', skill_desc: 'Relentless pace. Outlasts opponents in long rallies.', theme_primary: '#2e7d32', theme_accent: '#69f0ae', stats: { smash_power: 80, defense: 85, agility: 82, stamina: 96, strategy: 74 }, icon: 'gauge', profile_photo: player_profile_png('arun'), image: player_profile_png('arun'), placeholder_image: player_placeholder_url('Arun', '2e7d32'), comic_card_art: true },
  { name: 'Febin', team: 'Smash Masters', role: 'Doubles', nickname: 'THE SPEEDSTER', skill_type: 'Agility', skill_desc: 'Lightning-fast footwork and reflexes. Covers the court in a flash.', theme_primary: '#7cb342', theme_accent: '#ffeb3b', stats: { smash_power: 78, defense: 75, agility: 98, strategy: 72, stamina: 90 }, icon: 'lightning', profile_photo: player_profile_png('febin'), image: player_profile_png('febin'), placeholder_image: player_placeholder_url('Febin', '7cb342'), comic_card_art: true },
];

function SectionDivider() {
  return (
    <div className="section_divider">
      <div className="section_divider_line" />
      <div className="section_divider_dot" />
      <div className="section_divider_line" />
    </div>
  );
}

export default function App() {
  use_scroll_reveal();
  var [selected_player, set_selected_player] = useState(null);

  return (
    <>
      <Nav />

      {/* ===== HERO (full-cover carousel) ===== */}
      <TeamCarousel />

      <SectionDivider />

      {/* ===== ABOUT ===== */}
      <section className="section about_section" id="about">
        <div className="about_grid">
          <div className="about_text fade_up">
            <h2>Born from a Love<br />for the Game</h2>
            <p>
              CBL was born from a simple love for badminton in Chendamangalam. What started as
              friends meeting for weekend games grew into a full-fledged league where teams compete,
              friendships strengthen, and the spirit of sport shines.
            </p>
            <p>
              We believe every smash, every drop, and every rally brings us closer — not just to the
              net, but to each other. Our mission is to promote badminton at the
              <span className="highlight_text"> grassroots level</span> and build a healthy,
              active community through fair play and teamwork.
            </p>
          </div>
          <div className="stats_grid fade_up delay_2">
            <div className="stat_card">
              <div className="stat_number">3</div>
              <div className="stat_label">Competing Teams</div>
            </div>
            <div className="stat_card">
              <div className="stat_number">24<span className="unit">+</span></div>
              <div className="stat_label">Matches Played</div>
            </div>
            <div className="stat_card">
              <div className="stat_number">6</div>
              <div className="stat_label">Active Players</div>
            </div>
            <div className="stat_card">
              <div className="stat_number">100<span className="unit">+</span></div>
              <div className="stat_label">Fans & Supporters</div>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ===== PLAYERS ===== */}
      <section className="section players_section" id="players">
        <div className="section_header fade_up">
          <div className="section_label">Our Squad</div>
          <h2 className="section_title">Meet the CBL Players</h2>
          <p className="section_desc">
            The faces behind Thunder Boys, Smash Masters, and Smart Boys.
            Each player brings their own flair to the court.
          </p>
        </div>
        <PlayerCardsSlider players={PLAYERS} on_profile_click={set_selected_player} />
      </section>

      {selected_player ? (
        <PlayerProfilePopup player={selected_player} on_close={function () { set_selected_player(null); }} />
      ) : null}

      {/* ===== POINTS TABLE ===== */}
      <section className="section points_section" id="points">
        <div className="section_header fade_up points_section_header_min">
          <div className="section_label">Standings</div>
          <p className="section_desc">
            Track every win, every loss, and every point in the league.
          </p>
        </div>
        <div className="fade_up delay_2">
          <PointsTable />
        </div>
      </section>

      <SectionDivider />

      <Footer />
    </>
  );
}
