function toggleMenu() {
  const menu = document.getElementById("mobileMenu");
  menu.classList.toggle("active");
}
// Counter Animation
function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target.toLocaleString();
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current).toLocaleString();
    }
  }, 16);
}
// Intersection Observer for counter animation
const observerOptions = {
  threshold: 0.5,
  rootMargin: "0px",
};
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const target = parseInt(entry.target.getAttribute("data-target"));
      entry.target.textContent = "0";
      animateCounter(entry.target, target);
    }
  });
}, observerOptions);
// Observe all counter elements
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".feature-number").forEach((counter) => {
    observer.observe(counter);
  });
});
const canvas = document.getElementById("chartCanvas");
const ctx = canvas.getContext("2d");
function resizeCanvas() {
  const container = canvas.parentElement;
  canvas.width = container.offsetWidth;
  canvas.height = container.offsetHeight;
  initPoints();
}
resizeCanvas();
let points = [];
const numPoints = 60;
function initPoints() {
  points = [];
  for (let i = 0; i < numPoints; i++) {
    points.push({
      x: (canvas.width / (numPoints - 1)) * i,
      y:
        canvas.height / 2 + Math.sin(i * 0.3) * 50 + (Math.random() - 0.5) * 30,
      velocity: (Math.random() - 0.5) * 1.5,
      baseY: canvas.height / 2 + Math.sin(i * 0.3) * 50,
    });
  }
}
initPoints();
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Draw grid lines
  ctx.strokeStyle = "rgba(0, 217, 255, 0.1)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(0, (canvas.height / 5) * i);
    ctx.lineTo(canvas.width, (canvas.height / 5) * i);
    ctx.stroke();
  }
  // Draw main chart line with gradient
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
  gradient.addColorStop(0, "#00d9ff");
  gradient.addColorStop(0.5, "#0099ff");
  gradient.addColorStop(1, "#00d9ff");
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 5;
  ctx.shadowBlur = 25;
  ctx.shadowColor = "#00d9ff";
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length - 1; i++) {
    const xc = (points[i].x + points[i + 1].x) / 2;
    const yc = (points[i].y + points[i + 1].y) / 2;
    ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    // Animate points
    points[i].y += points[i].velocity;
    // Keep points within bounds and oscillate around base
    const diff = points[i].y - points[i].baseY;
    if (Math.abs(diff) > 40) {
      points[i].velocity *= -0.8;
    }
  }
  ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
  ctx.stroke();
  // Draw fill area under the line
  ctx.lineTo(canvas.width, canvas.height);
  ctx.lineTo(0, canvas.height);
  ctx.closePath();
  const fillGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  fillGradient.addColorStop(0, "rgba(0, 217, 255, 0.3)");
  fillGradient.addColorStop(1, "rgba(0, 217, 255, 0)");
  ctx.fillStyle = fillGradient;
  ctx.fill();
  // Draw data points
  ctx.shadowBlur = 15;
  for (let i = 0; i < points.length; i += 8) {
    ctx.beginPath();
    ctx.arc(points[i].x, points[i].y, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#00d9ff";
    ctx.fill();
  }
  requestAnimationFrame(animate);
}
animate();
window.addEventListener("resize", resizeCanvas);
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// Read More functionality with smooth transitions
function toggleReadMore(button) {
    const card = button.parentElement;
    const preview = card.querySelector('.solution-preview');
    const fullText = card.querySelector('.solution-full');
    
    // Close all other open cards first with smooth transition
    const allCards = document.querySelectorAll('.solution-card');
    allCards.forEach(otherCard => {
        if (otherCard !== card) {
            const otherPreview = otherCard.querySelector('.solution-preview');
            const otherFullText = otherCard.querySelector('.solution-full');
            const otherButton = otherCard.querySelector('.read-more-btn');
            
            if (otherFullText.style.display === 'block') {
                // Add fade out class
                otherFullText.classList.add('fade-out');
                
                setTimeout(() => {
                    otherPreview.style.display = 'block';
                    otherFullText.style.display = 'none';
                    otherButton.textContent = 'Read More';
                    otherFullText.classList.remove('fade-out');
                }, 400); // Match this with CSS transition time
            }
        }
    });
    
    // Toggle current card with smooth transition
    if (fullText.style.display === 'none' || fullText.style.display === '') {
        // Show full text
        preview.classList.add('fade-out');
        
        setTimeout(() => {
            preview.style.display = 'none';
            fullText.style.display = 'block';
            fullText.classList.add('fade-in');
            button.textContent = 'Show Less';
            
            setTimeout(() => {
                fullText.classList.remove('fade-in');
            }, 400);
        }, 400);
        
    } else {
        // Show preview
        fullText.classList.add('fade-out');
        
        setTimeout(() => {
            preview.style.display = 'block';
            fullText.style.display = 'none';
            button.textContent = 'Read More';
            preview.classList.remove('fade-out');
            fullText.classList.remove('fade-out');
        }, 400);
    }
}