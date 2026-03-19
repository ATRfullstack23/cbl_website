import { useState } from 'react';
import Nav from './components/Nav';
import TeamCarousel from './components/TeamCarousel';
import PlayerCard from './components/PlayerCard';
import PlayerProfilePopup from './components/PlayerProfilePopup';
import PointsTable from './components/PointsTable';
import Footer from './components/Footer';
import use_scroll_reveal from './hooks/use_scroll_reveal';

function player_image_path(name) {
  var slug = name.toLowerCase().replace(/\s+/g, '_');
  return '/images/players/' + slug + '.png';
}

function player_placeholder_url(name, hex_color) {
  var color = (hex_color || '7c3aed').replace('#', '');
  return 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name) + '&size=400&background=' + color + '&color=fff';
}

var PLAYERS = [
  { name: 'Elby', team: 'Thunder Boys', role: 'Singles', nickname: 'THE WALL', skill_type: 'Defense', skill_desc: 'Immovable at the net. Blocks and lifts turn into counter-attacks.', theme_primary: '#6a0dad', theme_accent: '#ffd700', stats: { smash_power: 72, defense: 99, agility: 78, strategy: 85, stamina: 88 }, icon: 'shield', image: player_image_path('elby'), placeholder_image: player_placeholder_url('Elby', '6a0dad') },
  { name: 'Amal', team: 'Thunder Boys', role: 'Doubles', nickname: 'THE POWERHOUSE', skill_type: 'Power', skill_desc: 'Devastating smashes and explosive jumps. Opponents fear the kill shot.', theme_primary: '#e65100', theme_accent: '#ffeb3b', stats: { smash_power: 98, defense: 70, agility: 82, strategy: 68, stamina: 85 }, icon: 'explosion', image: player_image_path('amal'), placeholder_image: player_placeholder_url('Amal', 'e65100') },
  { name: 'Amaldev', team: 'Smash Masters', role: 'Singles', nickname: 'THE STRATEGIST', skill_type: 'Strategy', skill_desc: 'Reads the game like a chess master. Drops and placement win points.', theme_primary: '#00897b', theme_accent: '#00e5ff', stats: { smash_power: 75, defense: 82, agility: 80, strategy: 97, stamina: 78 }, icon: 'tactics', image: player_image_path('amaldev'), placeholder_image: player_placeholder_url('Amaldev', '00897b') },
  { name: 'Febin', team: 'Smash Masters', role: 'Doubles', nickname: 'THE SPEEDSTER', skill_type: 'Agility', skill_desc: 'Lightning-fast footwork and reflexes. Covers the court in a flash.', theme_primary: '#7cb342', theme_accent: '#ffeb3b', stats: { smash_power: 78, defense: 75, agility: 98, strategy: 72, stamina: 90 }, icon: 'lightning', image: player_image_path('febin'), placeholder_image: player_placeholder_url('Febin', '7cb342') },
  { name: 'Arun', team: 'Smart Boys', role: 'Singles', nickname: 'THE ENGINE', skill_type: 'Stamina', skill_desc: 'Relentless pace. Outlasts opponents in long rallies.', theme_primary: '#2e7d32', theme_accent: '#69f0ae', stats: { smash_power: 80, defense: 85, agility: 82, stamina: 96, strategy: 74 }, icon: 'gauge', image: player_image_path('arun'), placeholder_image: player_placeholder_url('Arun', '2e7d32') },
  { name: 'Sanjay', team: 'Smart Boys', role: 'Doubles', nickname: 'THE PLAYMAKER', skill_type: 'Playmaking', skill_desc: 'Sets up partners and creates openings. The court conductor.', theme_primary: '#ff8f00', theme_accent: '#ffd54f', stats: { smash_power: 72, defense: 78, agility: 85, strategy: 92, stamina: 80 }, icon: 'playmaker', image: player_image_path('sanjay'), placeholder_image: player_placeholder_url('Sanjay', 'ff8f00') },
  { name: 'Player Seven', team: 'Thunder Boys', role: 'Mixed', nickname: 'THE ALL-ROUNDER', skill_type: 'Versatile', skill_desc: 'Balanced in every department. Reliable in any format.', theme_primary: '#5c6bc0', theme_accent: '#8c9eff', stats: { smash_power: 82, defense: 82, agility: 82, strategy: 82, stamina: 82 }, icon: 'star', image: player_image_path('player_seven'), placeholder_image: player_placeholder_url('Player Seven', '5c6bc0') },
  { name: 'Player Eight', team: 'Smash Masters', role: 'Mixed', nickname: 'THE FINISHER', skill_type: 'Clutch', skill_desc: 'Rises when it matters. Closes out tight games with confidence.', theme_primary: '#c62828', theme_accent: '#ff8a80', stats: { smash_power: 90, defense: 72, agility: 85, strategy: 80, stamina: 75 }, icon: 'target', image: player_image_path('player_eight'), placeholder_image: player_placeholder_url('Player Eight', 'c62828') },
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

  function handle_submit(e) {
    e.preventDefault();
  }

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
              <div className="stat_number">50<span className="unit">+</span></div>
              <div className="stat_label">Active Players</div>
            </div>
            <div className="stat_card">
              <div className="stat_number">1<span className="unit">K+</span></div>
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
        <div className="players_grid fade_up delay_2">
          {PLAYERS.map(function (player, i) {
            return (
              <PlayerCard
                key={i}
                player={player}
                on_profile_click={set_selected_player}
              />
            );
          })}
        </div>
      </section>

      {selected_player ? (
        <PlayerProfilePopup player={selected_player} on_close={function () { set_selected_player(null); }} />
      ) : null}

      {/* ===== POINTS TABLE ===== */}
      <section className="section points_section" id="points">
        <div className="section_header fade_up">
          <div className="section_label">Standings</div>
          <h2 className="section_title">CBL Points Table</h2>
          <p className="section_desc">
            Track every win, every loss, and every point in the league.
          </p>
        </div>
        <div className="fade_up delay_2">
          <PointsTable />
        </div>
      </section>

      <SectionDivider />

      {/* ===== CONTACT ===== */}
      <section className="section contact_section" id="contact">
        <div className="section_header fade_up">
          <div className="section_label">Get in Touch</div>
          <h2 className="section_title">Contact CBL</h2>
          <p className="section_desc">
            Have questions? Want to join or sponsor? Reach out to us.
          </p>
        </div>
        <div className="contact_inner">
          <div className="contact_cards fade_up delay_1">
            <div className="contact_card">
              <div className="contact_icon">📍</div>
              <h3>Venue</h3>
              <p>Chendamangalam Badminton Court, Kerala</p>
            </div>
            <div className="contact_card">
              <div className="contact_icon">📧</div>
              <h3>Email</h3>
              <p>cbl.league@example.com</p>
            </div>
            <div className="contact_card">
              <div className="contact_icon">📱</div>
              <h3>Phone</h3>
              <p>+91 XXXXX XXXXX</p>
            </div>
          </div>
          <div className="contact_form_wrap fade_up delay_3">
            <form className="contact_form" onSubmit={handle_submit}>
              <div className="form_row">
                <input type="text" name="name" placeholder="Your Name" required />
                <input type="email" name="email" placeholder="Your Email" required />
              </div>
              <input type="text" name="subject" placeholder="Subject" />
              <textarea name="message" rows={5} placeholder="Your message..." required />
              <button type="submit" className="btn_submit">Send Message</button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
