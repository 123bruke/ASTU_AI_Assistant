<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ASTU AI Assistant Animation</title>
<style>
  body {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: #111;
    color: #0ff;
    font-family: 'Courier New', Courier, monospace;
    font-size: 2rem;
  }

  .typewriter {
    display: inline-block;
    overflow: hidden;
    border-right: 0.15em solid #0ff; /* Cursor */
    white-space: nowrap;
    animation: blink-cursor 0.7s steps(1) infinite;
  }

  @keyframes blink-cursor {
    0%, 50%, 100% { border-color: #0ff; }
    25%, 75% { border-color: transparent; }
  }

  .text {
    display: inline;
  }

  /* Typing and deleting animations */
  @keyframes typing1 {
    0% { width: 0ch; }
    100% { width: 18ch; } /* ASTU AI ASSISTANT */
  }

  @keyframes deleting1 {
    0% { width: 18ch; }
    100% { width: 0ch; }
  }

  @keyframes typing2 {
    0% { width: 0ch; }
    100% { width: 14ch; } /* SHOW AI POWERED */
  }

  @keyframes deleting2 {
    0% { width: 14ch; }
    100% { width: 0ch; }
  }

  .typewriter span {
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
  }

  .line1 {
    animation: typing1 2s steps(18) forwards, deleting1 2s steps(18) 4s forwards;
  }

  .line2 {
    animation: typing2 2s steps(14) 6s forwards, deleting2 2s steps(14) 10s forwards;
  }

  /* Infinite loop */
  .typewriter {
    animation: none;
  }

  .wrapper {
    display: inline-block;
  }

</style>
</head>
<body>
  <div class="typewriter wrapper">
    <span class="line1">ASTU AI ASSISTANT</span>
    <span class="line2"></span>
  </div>

<script>
  // JavaScript to loop the animation infinitely
  const wrapper = document.querySelector('.wrapper');
  const line1 = document.querySelector('.line1');
  const line2 = document.querySelector('.line2');

  function runAnimation() {
    line1.textContent = "ASTU AI ASSISTANT";
    line1.style.width = '0ch';
    line2.textContent = "SHOW AI POWERED";
    line2.style.width = '0ch';

    // Animate line1
    line1.animate([{ width: '0ch' }, { width: '18ch' }], { duration: 2000, fill: 'forwards' })
      .onfinish = () => {
        line1.animate([{ width: '18ch' }, { width: '0ch' }], { duration: 2000, fill: 'forwards' })
        .onfinish = () => {
          // Animate line2
          line2.animate([{ width: '0ch' }, { width: '14ch' }], { duration: 2000, fill: 'forwards' })
          .onfinish = () => {
            line2.animate([{ width: '14ch' }, { width: '0ch' }], { duration: 2000, fill: 'forwards' })
            .onfinish = () => {
              runAnimation(); // repeat
            }
          }
        }
      }
  }

  runAnimation();
</script>
</body>
</html>
