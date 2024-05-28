document.getElementById('addButton').addEventListener('click', function() {
  const name = document.getElementById('name').value;
  const datum = document.getElementById('datum').value;
  const groesse = document.getElementById('größe').value;

  if (name && datum && groesse) {
    const newEntry = { name, datum, groesse, left: 0, top: 0 };
    const existingEntries = JSON.parse(localStorage.getItem('measurements')) || [];
    existingEntries.push(newEntry);
    localStorage.setItem('measurements', JSON.stringify(existingEntries));
    window.location.href = 'Startseite.html';
  }
});
