export default function Footer() {
  function handle_click(e, href) {
    e.preventDefault();
    var el = document.getElementById(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <footer className="footer">
      <div className="footer_inner">
        <div className="footer_grid">
          <div>
            <div className="footer_brand">CBL<span className="accent"> League</span></div>
            <p className="footer_desc">Chendamangalam Badminton League — Where passion meets the court and champions rise.</p>
          </div>
          <div>
            <h4>Navigate</h4>
            <ul>
              <li><a href="#home" onClick={function (e) { handle_click(e, 'home'); }}>Home</a></li>
              <li><a href="#about" onClick={function (e) { handle_click(e, 'about'); }}>About</a></li>
              <li><a href="#players" onClick={function (e) { handle_click(e, 'players'); }}>Players</a></li>
              <li><a href="#points" onClick={function (e) { handle_click(e, 'points'); }}>Points</a></li>
              <li><a href="#contact" onClick={function (e) { handle_click(e, 'contact'); }}>Contact</a></li>
            </ul>
          </div>
          <div>
            <h4>Teams</h4>
            <ul>
              <li>Thunder Boys</li>
              <li>Smash Masters</li>
              <li>Smart Boys</li>
            </ul>
          </div>
          <div>
            <h4>Follow Us</h4>
            <ul>
              <li><a href="#">Instagram</a></li>
              <li><a href="#">YouTube</a></li>
              <li><a href="#">WhatsApp</a></li>
            </ul>
          </div>
        </div>
        <div className="footer_bottom">
          &copy; 2025 Chendamangalam Badminton League. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
