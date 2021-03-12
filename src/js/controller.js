import * as model from './model.js';
import recipeView from './views.js/recipeView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

const recipeContainer = document.querySelector('.recipe');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();
    //load recipe
    await model.loadRecipe(id);

    //rendring recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    alert(err);
  }
};
['hashchange', 'load'].forEach(e => window.addEventListener(e, controlRecipe));
