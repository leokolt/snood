document.addEventListener("DOMContentLoaded", function(event) {



/*spoilers*/
const s = document.querySelectorAll('[data-element="spoiler"]');

s.forEach(item => {
    item.addEventListener('click', function() {
        if(item.getAttribute('data-state', 'show')) {
            item.removeAttribute('data-state', 'show');
        } else {
            item.setAttribute('data-state', 'show');
        }
    });
});


/*accordion*/
const a = document.querySelectorAll('[data-element="accordion"]');

a.forEach(item => {
    item.addEventListener('click', () => {
        a.forEach(acc => acc.removeAttribute('data-state', 'collapsed'));
        item.setAttribute('data-state', 'collapsed');
  });
});

/*alert*/
const al = document.querySelectorAll('[data-element="alert-close"]');

al.forEach(item => {
    item.addEventListener('click', () => {
        item.parentElement.style.display = 'none';
    });
});


/*tabs*/
const t = document.querySelector('[data-element="triggers"]'),
      tc = document.querySelectorAll('[data-element="panel"]'),
      tt = document.querySelectorAll('[data-element="trigger"]');

function tcl() {
    tc.forEach(item => {
        item.setAttribute('data-state', 'hidden');
    })
    tt.forEach(item => {
        item.setAttribute('aria-selected', 'false');
    })
}

function to(i) {
    tc[i].setAttribute('data-state', 'visible');
    tt[i].setAttribute('aria-selected', 'true');
}

tcl();
to(0);

t.addEventListener('click', (e) => {
    if (e.target && e.target.getAttribute('data-element', 'triggers')) {
        tt.forEach((item, i) => {
            if (e.target == item) {
                tcl();
                to(i);
            }
        });
    }
})


  });
