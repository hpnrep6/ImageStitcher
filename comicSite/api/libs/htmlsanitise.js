// replaces all characters that can cause a html injection
function sanitise(string) {
    return string.
    replace('&', '&amp;').
    replace('<', '&lt;').
    replace('>', '&gt;').
    replace('\'', '&apos;').
    replace('\"', '&quot;');
}

module.exports = sanitise;