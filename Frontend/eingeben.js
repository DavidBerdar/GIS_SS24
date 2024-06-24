document.getElementById('addButton').addEventListener('click', function() {
  const name = document.getElementById('name').value;
  const datum = document.getElementById('datum').value;
  const groesse = document.getElementById('größe').value;

  if (name && datum && groesse) {
    const newEntry = { name, datum, groesse };

    fetch('http://127.0.0.1:8080/measurements', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newEntry),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Successfully added measurement:', data);
     
      window.location.href = 'Startseite.html';
    })
    .catch(error => {
      console.error('Error adding measurement:', error);
      
    });
  }
});
