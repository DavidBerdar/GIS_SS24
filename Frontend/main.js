document.addEventListener('DOMContentLoaded', function() {
  const dataList = document.getElementById('dataList');

  function fetchMeasurements() {
    fetch('http://127.0.0.1:8080/measurements')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        renderList(data);
      })
      .catch(error => {
        console.error('Error fetching measurements:', error);
      });
  }

  fetchMeasurements();

  function renderList(data) {
    dataList.innerHTML = '';
    data.forEach(entry => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `${entry.name}, ${entry.datum}, ${entry.groesse} cm 
        <button onclick="deleteEntry(${entry.id})">Löschen</button>`;
      listItem.style.left = `${entry.left}px`;
      listItem.style.top = `${entry.top}px`;
      listItem.classList.add('draggable');
      listItem.dataset.id = entry.id;
      listItem.setAttribute('draggable', true);
      listItem.addEventListener('dragstart', dragStart);
      dataList.appendChild(listItem);
    });
  }

  window.deleteEntry = function(id) {
    fetch(`http://127.0.0.1:8080/measurements/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Successfully deleted measurement:', data);
        fetchMeasurements();
      })
      .catch(error => {
        console.error('Error deleting measurement:', error);
      });
  };

  let draggedItem = null;
  let offsetX, offsetY;

  function dragStart(e) {
    draggedItem = e.target;
    offsetX = e.clientX - draggedItem.getBoundingClientRect().left;
    offsetY = e.clientY - draggedItem.getBoundingClientRect().top;
  }

  function dragOver(e) {
    e.preventDefault();
  }

  function drop(e) {
    if (!draggedItem) return;
    const rect = dataList.getBoundingClientRect();
    const x = e.clientX - rect.left - offsetX;
    const y = e.clientY - rect.top - offsetY;
    draggedItem.style.left = `${x}px`;
    draggedItem.style.top = `${y}px`;

    const id = draggedItem.dataset.id;
    const updateData = { left: x, top: y };

    fetch(`http://127.0.0.1:8080/measurements/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Successfully updated measurement:', data);
      })
      .catch(error => {
        console.error('Error updating measurement:', error);
      });

    draggedItem = null;
  }

  dataList.addEventListener('dragover', dragOver);
  dataList.addEventListener('drop', drop);
});
