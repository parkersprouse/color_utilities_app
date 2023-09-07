/* -------------------------------------- *
 *                Source:                 *
 * https://codepen.io/jester6/pen/zYqRKBN *
 * -------------------------------------- */
import gsap from 'gsap';
import Draggable from 'gsap/Draggable';

gsap.registerPlugin(Draggable);


/* --------------------------------------
 * Constants
 * -------------------------------------- */

const attribute = Object.freeze({
  UNIT: 'data-unit',
  VALUE: 'data-value',
  VALUES: 'data-values',
});

const selector = Object.freeze({
  SLIDER_CLASS: '.inputslider',
  SLIDER_ID: 'percent_slider',
  VALUES_WRAPPER: '.values',
  VALUE_SPANS: '.values span',
});


/* --------------------------------------
 * Helper Methods
 * -------------------------------------- */

function addClass(ele, className) {
  if (ele) ele.classList.add(className);
}

function removeClass(ele, className) {
  if (ele) ele.classList.remove(className);
}

function toFloat(val) {
  return Number.parseFloat(val);
}


/* --------------------------------------
 * Slider Logic
 * -------------------------------------- */

function setSelectedValue(slider, input, span, value, slider_values) {
  const inputslider = slider.target.closest(selector.SLIDER_CLASS);
  // ---------------------
  for (const entry of inputslider.querySelectorAll(selector.VALUE_SPANS)) removeClass(entry, 'selected');
  addClass(span, 'selected');
  document.getElementById(selector.SLIDER_ID).setAttribute(attribute.VALUE, value);
  input.value = value;
  // ---------------------
  const fill = inputslider.querySelector('.fill');
  const max = toFloat(slider_values[slider_values.length - 1]);
  const min = toFloat(slider_values[0]);
  const relativeValue = gsap.utils.mapRange(0, slider.maxX, min, max, span.offsetLeft);
  const finalValue = gsap.utils.snap(slider_values, relativeValue);
  const snapX = gsap.utils.mapRange(min, max, 0, slider.maxX, finalValue);
  const fillWidth = gsap.utils.mapRange(0, slider.maxX, 0, 100, snapX);
  gsap.to(slider.target, { duration: 0.2, x: snapX });
  gsap.to(fill, { duration: 0.2, width: `${fillWidth}%` });
}

function handleInputSlider(instance, snap, slider_values, input) {
  const inputslider = instance.target.closest(selector.SLIDER_CLASS);
  const fill = inputslider.querySelector('.fill');

  const max = toFloat(slider_values[slider_values.length - 1]);
  const min = toFloat(slider_values[0]);
  const relativeValue = gsap.utils.mapRange(0, instance.maxX, min, max, instance.x);

  const finalValue = gsap.utils.snap(slider_values, relativeValue);
  const snapX = gsap.utils.mapRange(min, max, 0, instance.maxX, finalValue);
  const fillWidth = gsap.utils.mapRange(0, instance.maxX, 0, 100, snapX);

  if (snap) {
    gsap.to(instance.target, { duration: 0.2, x: snapX });
    gsap.to(fill, { duration: 0.2, width: `${fillWidth}%` });
  } else {
    let i = 0;
    for (const val of slider_values) {
      slider_values[i] = toFloat(val);
      i += 1;
    }

    const xPercent = gsap.utils.mapRange(0, instance.maxX, 0, 100, instance.x);
    fill.style.width = `${xPercent}%`;

    for (const span of inputslider.querySelectorAll(selector.VALUE_SPANS)) {
      const option_value = toFloat(span.getAttribute(attribute.VALUE));
      if (option_value === toFloat(finalValue)) {
        addClass(span, 'selected');
        document.getElementById(selector.SLIDER_ID).setAttribute(attribute.VALUE, option_value);
      } else {
        removeClass(span, 'selected');
      }
    }

    input.value = finalValue;
  }
}

export function initSliders() {
  for (const inputslider of document.querySelectorAll(selector.SLIDER_CLASS)) {
    const slider_values = inputslider.getAttribute(attribute.VALUES).split(',');
    const slider_value = toFloat(inputslider.getAttribute(attribute.VALUE));
    const unit = inputslider.getAttribute(attribute.UNIT) || '';
    const area = inputslider.querySelector('.area');
    const input = inputslider.querySelector('input');
    const knob = inputslider.querySelector('.knob');

    const slider = Draggable.create(knob, {
      bounds: area,
      edgeResistance: 1,
      throwProps: false,
      type: 'x',
      onDrag() {
        handleInputSlider(this, false, slider_values, input);
      },
      onDragEnd() {
        handleInputSlider(this, true, slider_values, input);
      },
    })[0];

    let i = 0;
    for (const val of slider_values) {
      const parsedValue = toFloat(val);
      slider_values[i] = parsedValue;

      const span = document.createElement('span');
      span.textContent = `${parsedValue}${unit}`;
      span.setAttribute(attribute.VALUE, parsedValue);
      addClass(span, 'percent_slider__value');
      span.style.left = `${gsap.utils.mapRange(
        toFloat(slider_values[0]),
        toFloat(slider_values[slider_values.length - 1]),
        0,
        100,
        parsedValue,
      )}%`;

      if (slider_value === parsedValue) {
        setSelectedValue(slider, input, span, parsedValue, slider_values);
      }
      span.addEventListener('click', () => {
        setSelectedValue(slider, input, span, parsedValue, slider_values);
      });

      inputslider.querySelector(selector.VALUES_WRAPPER).appendChild(span);
      i += 1;
    }
  }
}

export default {
  initSliders,
};
