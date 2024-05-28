document.addEventListener('DOMContentLoaded', function() {
    const dataList = document.getElementById('dataList');
    let data = JSON.parse(localStorage.getItem('measurements')) || [];
  
    function renderList() {
      dataList.innerHTML = '';
      data.forEach((entry, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `${entry.name}, ${entry.datum}, ${entry.groesse} cm 
          <button onclick="deleteEntry(${index})">Löschen</button>`;
        listItem.style.top = entry.top ? `${entry.top}px` : '0px';
        listItem.style.left = entry.left ? `${entry.left}px` : '0px';
        listItem.setAttribute('draggable', true);
        listItem.classList.add('draggable');
        listItem.dataset.index = index;
        listItem.addEventListener('dragstart', dragStart);
        dataList.appendChild(listItem);
      });
    }
  
    window.deleteEntry = function(index) {
      data.splice(index, 1);
      localStorage.setItem('measurements', JSON.stringify(data));
      renderList();
    }
  
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
      const index = draggedItem.dataset.index;
      data[index].left = x;
      data[index].top = y;
      localStorage.setItem('measurements', JSON.stringify(data));
      draggedItem = null;
    }
  
    dataList.addEventListener('dragover', dragOver);
    dataList.addEventListener('drop', drop);
  
    renderList();
  });
  