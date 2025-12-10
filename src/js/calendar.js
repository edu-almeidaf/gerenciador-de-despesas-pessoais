document.addEventListener('DOMContentLoaded', () => {
  const callyWidget = document.getElementById('cally-widget');
  const displaySpan = document.getElementById('data-display');
  const hiddenInput = document.getElementById('data-input');
  const btnLimpar = document.getElementById('btn-limpar');

  if (callyWidget) {
    callyWidget.addEventListener('change', (event) => {
      const selectedDate = event.target.value;

      hiddenInput.value = selectedDate;
      const [year, month, day] = selectedDate.split('-');
      displaySpan.textContent = `${day}/${month}/${year}`;

      displaySpan.classList.remove('text-zinc-400');
      displaySpan.classList.add('text-zinc-950');

      btnLimpar.classList.remove('hidden');

      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    });

    btnLimpar.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });

    btnLimpar.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();

      callyWidget.value = '';
      hiddenInput.value = '';

      displaySpan.textContent = 'Selecionar data...';
      displaySpan.classList.remove('text-zinc-950');
      displaySpan.classList.add('text-zinc-400');

      btnLimpar.classList.add('hidden');
    });
  }
});
