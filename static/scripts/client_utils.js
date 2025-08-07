
window.COMMON_UTILS = {

    get_lighter_color: function(color_string, lighten_percent = 30) {
        let r, g, b, a = 1;

        color_string = color_string.trim().toLowerCase();

        // Convert hex to rgb
        if (color_string.startsWith('#')) {
            let hex = color_string.slice(1);

            // Expand short hex (#rgb → #rrggbb)
            if (hex.length === 3) {
                hex = hex.split('').map(ch => ch + ch).join('');
            }

            if (hex.length !== 6) {
                throw new Error('Invalid hex color format');
            }

            r = parseInt(hex.slice(0, 2), 16);
            g = parseInt(hex.slice(2, 4), 16);
            b = parseInt(hex.slice(4, 6), 16);
        }

        // Parse rgb / rgba
        else if (color_string.startsWith('rgb')) {
            const match = color_string
                .replace(/\s+/g, '')
                .match(/^rgba?\((\d+),(\d+),(\d+)(?:,([\d.]+))?\)$/);

            if (!match) {
                throw new Error('Invalid RGB or RGBA color format');
            }

            r = parseInt(match[1], 10);
            g = parseInt(match[2], 10);
            b = parseInt(match[3], 10);
            a = match[4] !== undefined ? parseFloat(match[4]) : 1;
        }

        else {
            throw new Error('Unsupported color format. Use hex, rgb, or rgba.');
        }

        // Lighten each RGB channel toward 255 (white)
        const lighten = (channel) =>
            Math.round(channel + (255 - channel) * (lighten_percent / 100));

        const new_r = lighten(r);
        const new_g = lighten(g);
        const new_b = lighten(b);

        return a < 1
            ? `rgba(${new_r}, ${new_g}, ${new_b}, ${a})`
            : `rgb(${new_r}, ${new_g}, ${new_b})`;
    }
}


