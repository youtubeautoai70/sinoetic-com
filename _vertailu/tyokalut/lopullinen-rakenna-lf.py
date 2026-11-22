# Lopullinen sivu: ajaa _aineisto/lopullinen-sivu/lahde/rakenna.py:n muuttamattomana niin, että Path.write_text kirjoittaa LF-rivinvaihdot.
# Windowsissa rakenna.py kirjoittaa muuten CRLF:t, jolloin tulos ei ole tavu tavulta sama kuin index.html (sisältö on sama).
# Käyttö: python _vertailu/tyokalut/lopullinen-rakenna-lf.py _aineisto/lopullinen-sivu/lahde/rakenna.py
import pathlib, runpy, sys
_orig = pathlib.Path.write_text
def _lf(self, data, encoding=None, errors=None, newline=None):
    return _orig(self, data, encoding=encoding, errors=errors, newline="\n")
pathlib.Path.write_text = _lf
runpy.run_path(sys.argv[1], run_name="__main__")
