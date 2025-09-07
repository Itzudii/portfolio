export class Achievement{
      constructor(){

        
        this.achEl = document.getElementById('achievement-popup');
        this.titleEl = document.getElementById('ach-title');
        this.descEl = document.getElementById('ach-desc');
        this.hideTimeout;
        this.sections = document.querySelectorAll('.ach-block');
      }
      
      showAchievement(title, desc){
      this.titleEl.textContent = title;
      this.descEl.textContent = desc;
      this.achEl.classList.add('show');
      clearTimeout(this.hideTimeout);
      this.hideTimeout = setTimeout(()=>{
        this.achEl.classList.remove('show');
      },3000);
    }
    init(){

      window.addEventListener('scroll', ()=>{
        this.sections.forEach(sec=>{
          const rect = sec.getBoundingClientRect();
          if(rect.top < window.innerHeight/2 && rect.bottom > window.innerHeight/2 && !sec.dataset.shown){
            sec.dataset.shown = true;
            this.showAchievement(sec.dataset.title, sec.dataset.desc);
          }
        });
        if(window.scrollY < 40){
          this.sections.forEach(sec=> delete sec.dataset.shown);
        }
      });
    }
  }