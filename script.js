    let pollData = {};
    function addOption() {
      const optionsDiv = document.getElementById('options');
      const newOption = document.createElement('div');
      newOption.className = 'option';
      newOption.innerHTML = '<input type="text" placeholder="New Option" class="option-input">';
      optionsDiv.appendChild(newOption);
    }

    function createPoll() {
      const title = document.getElementById('pollTitle').value.trim();
      const optionInputs = document.querySelectorAll('.option-input');
      const options = Array.from(optionInputs).map(input => input.value.trim()).filter(Boolean);

      if (!title || options.length < 2) {
        alert('Please enter a valid question and at least two options.');
        return;
      }

      pollData = {
        title,
        options: options.map(opt => ({ name: opt, votes: 0 }))
      };

      renderResults();
    }

    function copyLink() {
      const encoded = btoa(JSON.stringify(pollData));
      const link = `${window.location.href.split('?')[0]}?poll=${encoded}`;
      navigator.clipboard.writeText(link).then(() => {
        alert("Poll link copied to clipboard!");
      });
    }

    function loadPoll(encoded) {
      try {
        pollData = JSON.parse(atob(encoded));
        renderResults();
      } catch (e) {
        alert('Failed to load poll.');
      }
    }

    function renderResults() {
      const container = document.getElementById('resultsContainer');
      const resultsDiv = document.getElementById('results');
      const pollQuestion = document.getElementById('pollQuestion');
      const linkDisplay = document.getElementById('linkDisplay');
      container.style.display = 'block';
      pollQuestion.innerHTML = `<strong>${pollData.title}</strong>`;
      resultsDiv.innerHTML = '';

      pollData.options.forEach((opt, index) => {
        const bar = document.createElement('div');
        bar.className = 'bar';

        const barFill = document.createElement('div');
        barFill.className = 'bar-fill';
        const percentage = getPercentage(opt.votes);
        barFill.style.width = percentage + '%';
        barFill.innerText = `${opt.name} - ${opt.votes} votes (${percentage}%)`;

        bar.onclick = () => vote(index);
        bar.appendChild(barFill);
        resultsDiv.appendChild(bar);
      });

      const encoded = btoa(JSON.stringify(pollData));
      linkDisplay.innerHTML = `📎 Share this poll: Click to copy link`;
      linkDisplay.setAttribute('data-link', `${window.location.href.split('?')[0]}?poll=${encoded}`);
    }

    function vote(index) {
      pollData.options[index].votes++;
      renderResults();
    }

    function getPercentage(votes) {
      const total = pollData.options.reduce((sum, opt) => sum + opt.votes, 0);
      if (total === 0) return 0;
      return Math.round((votes / total) * 100);
    }

    // Auto-load if link contains a poll
    const urlParams = new URLSearchParams(window.location.search);
    const pollParam = urlParams.get('poll');
    if (pollParam) {
      loadPoll(pollParam);
    }