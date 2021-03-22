import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarkView.js';
import paginationView from './views/paginationView.js';
import AddRecipeView from './views/addrecipeView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime/runtime';
import addrecipeView from './views/addrecipeView.js';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();
    //load recipe
    await model.loadRecipe(id);

    resultsView.update(model.getSearchResultsPage());
    //rendring recipe
    recipeView.render(model.state.recipe);

    // bookmarksView.update(model.state.bookmarks);
  } catch (err) {
    recipeView.renderError(err);
  }
};

const controllSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    const query = searchView.getQuery();
    if (!query) return;
    await model.loadSearchResult(query);
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controllPagination = function (gotoPage) {
  resultsView.render(model.getSearchResultsPage(gotoPage));
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  model.updateServings(newServings);
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controllAddBookMark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  recipeView.update(model.state.recipe);

  bookmarksView.render(model.state.bookmarks);
};

const controlBookmark = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controladdRecipe = async function (newrecipe) {
  try {
    addrecipeView.renderSpinner();
    await model.uploadRecipe(newrecipe);
    recipeView.render(model.state.recipe);

    setTimeout(function () {
      recipeView.toggleWindow;
    }, 2500);
    addrecipeView.renderMessage(addrecipeView._msz);
    bookmarksView.render(model.state.bookmarks);

    window.history.pushState(null, '', `${model.state.recipe.id}`);
  } catch (err) {
    AddRecipeView.renderError(err.message);
  }
};

function init() {
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHnadlerBookmark(controllAddBookMark);
  searchView.addHandleSearch(controllSearchResults);
  bookmarksView.addHandlerRender(controlBookmark);
  paginationView.addHandlerClick(controllPagination);
  AddRecipeView.addHandlerUpload(controladdRecipe);
}
init();
