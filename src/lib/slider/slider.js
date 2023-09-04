import gsap from 'gsap';
import Draggable from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

function addClass(ele, className) {
  if (!ele || ele.classList.contains(className)) return;
  ele.classList.add(className);
}

function removeClass(ele, className) {
  if (!ele || !ele.classList.contains(className)) return;
  ele.classList.remove(className);
}

function handleInputSlider(instance, snap) {
  const inputslider = instance.target.closest('.inputslider');
  const fill = inputslider.querySelector('.fill');
  const values = inputslider.getAttribute('data-values').split(',');
  const min = Number.parseFloat(values[0]);
  const max = Number.parseFloat(values[values.length - 1]);
  const xPercent = gsap.utils.mapRange(0, instance.maxX, 0, 100, instance.x);
  const relativeValue = gsap.utils.mapRange(0, instance.maxX, min, max, instance.x);
  const finalValue = gsap.utils.snap(values, relativeValue);
  const snapX = gsap.utils.mapRange(min, max, 0, instance.maxX, finalValue);
  const fillWidth = gsap.utils.mapRange(0, instance.maxX, 0, 100, snapX);

  if (snap) {
    gsap.to(instance.target, { duration: 0.2, x: snapX });
    gsap.to(fill, { duration: 0.2, width: `${fillWidth}%` });
  } else {
    let i = 0;
    for (const val of values) {
      values[i] = Number.parseFloat(val);
      i += 1;
    }

    fill.style.width = `${xPercent}%`;

    for (const span of inputslider.querySelectorAll('.values span')) {
      if (Number.parseFloat(span.getAttribute('data-value')) === finalValue) {
        addClass(span, 'selected');
      } else {
        removeClass(span, 'selected');
      }
    }

    inputslider.querySelector('input').value = finalValue;
  }
}

export function initSliders() {
  for (const inputslider of document.querySelectorAll('.inputslider')) {
    let unit = '';
    const values = inputslider.getAttribute('data-values').split(',');
    // const value = Number.parseFloat(inputslider.getAttribute('data-value'));
    const min = Number.parseFloat(values[0]);
    const max = Number.parseFloat(values[values.length - 1]);
    const area = inputslider.querySelector('.area');
    // const fill = inputslider.querySelector('.fill');
    const input = inputslider.querySelector('input');
    const knob = inputslider.querySelector('.knob');

    if (inputslider.getAttribute('data-unit')) {
      unit = inputslider.getAttribute('data-unit');
    }

    let i = 0;
    for (const val of values) {
      const parsedValue = Number.parseFloat(val);
      values[i] = parsedValue;

      const span = document.createElement('span');
      span.textContent = parsedValue + unit;
      span.setAttribute('data-value', parsedValue);

      if (i === 0) {
        addClass(span, 'selected');
        input.value = parsedValue;
      }

      span.style.left = `${gsap.utils.mapRange(min, max, 0, 100, parsedValue)}%`;
      inputslider.querySelector('.values').appendChild(span);

      i += 1;
    }

    Draggable.create(knob, {
      type: 'x',
      edgeResistance: 1,
      bounds: area,
      throwProps: false,
      onDrag() {
        handleInputSlider(this, false);
      },
      onDragEnd() {
        handleInputSlider(this, true);
      },
    });
  }
}

export default {
  initSliders,
};
