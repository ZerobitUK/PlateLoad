document.addEventListener('DOMContentLoaded', () => {
  const targetWeightInput = document.getElementById('targetWeight');
  const barbellWeightSelect = document.getElementById('barbellWeight');
  const plateCheckboxes = document.querySelectorAll('.plate-checkbox');
  const resultsDiv = document.getElementById('results');

  function calculatePlates() {
    const targetWeight = parseFloat(targetWeightInput.value) || 0;
    const barbellWeight = parseFloat(barbellWeightSelect.value);

    // Clear previous results
    resultsDiv.innerHTML = '';

    if (targetWeight < barbellWeight) {
      resultsDiv.innerHTML = '<h3>Target weight must be at least the barbell weight.</h3>';
      return;
    }

    const availablePlates = Array.from(plateCheckboxes)
      .filter(checkbox => checkbox.checked)
      .map(checkbox => parseFloat(checkbox.value))
      .sort((a, b) => b - a); // Sort plates from heaviest to lightest

    let weightNeeded = targetWeight - barbellWeight;
    if (weightNeeded < 0) weightNeeded = 0;

    let weightPerSide = weightNeeded / 2;
    const platesToLoad = [];
    let remainingWeightPerSide = weightPerSide;

    // Greedy algorithm to find plate combination
    for (const plate of availablePlates) {
      while (remainingWeightPerSide >= plate) {
        platesToLoad.push(plate);
        remainingWeightPerSide -= plate;
      }
    }

    const loadedWeight = barbellWeight + (platesToLoad.length * 2 * (weightPerSide / platesToLoad.reduce((a, b) => a + b, 0) || 1) * 2);


    displayResults(platesToLoad, weightPerSide);
  }

  function displayResults(plates, weightPerSide) {
    let html = `<h3>Plates to load on each side (${weightPerSide.toFixed(2)} kg):</h3>`;

    if (plates.length === 0) {
      html += '<p>Just the bar!</p>';
    } else {
      const plateCounts = plates.reduce((acc, plate) => {
        acc[plate] = (acc[plate] || 0) + 1;
        return acc;
      }, {});

      html += '<ul class="plate-breakdown">';
      for (const plate in plateCounts) {
        html += `<li>${plateCounts[plate]} x ${plate} kg</li>`;
      }
      html += '</ul>';
    }

    resultsDiv.innerHTML = html;
  }

  // Event Listeners
  targetWeightInput.addEventListener('input', calculatePlates);
  barbellWeightSelect.addEventListener('change', calculatePlates);
  plateCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', calculatePlates);
  });

  // Initial calculation
  calculatePlates();
});
