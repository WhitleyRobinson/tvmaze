"use strict";

async function searchShows(query) {
  let $show = $(await axios.get(`http://api.tvmaze.com/search/shows?q=${query}`));
  let showArr = $show[0].data;
  return showArr.map(function(show) {
    return {
      id: show.show.id,
      name: show.show.name,
      summary: show.show.summary,
      image: show.show.image.medium
    };
  });
}

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  const response = await axios ({
    baseURL: TVMAZE_API_URL,
    url: "search/shows",
    method: "GET",
    params: {
      q: term,
    },
  });
  // ADD: Remove placeholder & make request to TVMaze search shows API.

  return response.data.map(result => {
    const show = result.show;
    return {
      id: show.id,
      name: show.name,
      summary: show.summary,
      image: show.image ? show.image.medium : MISSING_IMAGE_URL,
    };
  });
}

     // id: 1767,
      //name: "The Bletchley Circle",
      //summary:
        //`<p><b>The Bletchley Circle</b> follows the journey of four ordinary
          // women with extraordinary skills that helped to end World War II.</p>
         //<p>Set in 1952, Susan, Millie, Lucy and Jean have returned to their
           //normal lives, modestly setting aside the part they played in
           //producing crucial intelligence, which helped the Allies to victory
           //and shortened the war. When Susan discovers a hidden code behind an
           //unsolved murder she is met by skepticism from the police. She
           //quickly realises she can only begin to crack the murders and bring
           //the culprit to justice with her former friends.</p>`,
      //image:
        //"http://static.tvmaze.com/uploads/images/medium_portrait/147/369403.jpg"
    //}
  //];
//}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  const $showsList = $('#shows-list');
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
      <div class="card" data-show-id="${show.id}" data-show-name="${show.name}">
      <div class="card-body">
      <img class="card-img-top" src="${show.name}">
      <h5 class="card-title">${show.name}</h5>
      <p class="card-text">${show.summary}</p>
      <button class="btn btn-info>Get Episodes</button>
    </div>
  </div>
</div>
`
    );

    $showsList.append($item);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

$('#search-form').on("submit", async function handleSearch(evt) {
  evt.preventDefault();

  let query = $('#search-query').val();
  if (!query) return;

  $('#episodes-area').hide();

  let shows = await searchShows(query);

populateShows(shows);

});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */
async function getEpisodesOfShow(id) {
  let $episodes = $(await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`));
    return ($episodes[0].data.map(function(episode) {
      return {
        id: episode.id,
        season: episode.season,
        number: episode.number,
        name: episode.name,
        summary: episode.summary
      }
    }))
}

async function populateEpisodes(episodes) {
  console.log(episodes);
  const $episodesList = $('#episodes-list');
  $episodesList.empty();
      for (let episode of episodes) {
        console.log(episode);
        let $item = $(`
          <li class="list-group-item" data-episode-id="${episode.id}">
            <h3 class="h3">${episode.name}</h3>
            <p class="lead">Season ${episode.season}, Episode ${episode.number}</p>
            <p>${episode.summary}</p>
          </li>`
        )
        $episodesList.append($item);
      }
    }


$('#shows-list').on('click', async function(evt) {

  evt.preventDefault();

  let evtTgt = event.target;

  if (evtTgt.classList.contains('btn')) {
    $('#shows-list').hide();
    $('#search-query').val("");
    $("#episodes-area").show();
    let showData = evtTgt.parentElement.parentElement.dataset;
    console.log(showData.showName);
    $('#episodes-area').prepend(`<h1 class="h1>${showData.showName}</h1>`);
    let $episodeArr = $(await getEpisodes(showData.showId));
    console.log($episodeArr);
    populateEpisodes($episodeArr);
  }
});
    // async function getEpisodesOfShow(id) { }

/** Write a clear docstring for this function... */

// function populateEpisodes(episodes) { }
