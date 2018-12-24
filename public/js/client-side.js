$("document").ready(() => {
  // define funcion expression scrapeArticles for POST ajax call
  const scrapeArticle = () => {
    $.ajax({
        method: "POST",
        url: "/articles",
        success: (response) => {
            console.log(`scrape was successful: ${JSON.stringify(response)}`);
        },
        error: (err) => {
            console.log(JSON.stringify(err));
        }
    });
  };
  // function expression that make ajax call to update saved value of article
  const updateArticle = (id, saved) => {
      $.ajax({
        method: "PUT",
        url: "/articles",
        data: {
            id: id,
            saved: saved
        },
        success: (response) => {
            console.log(`article update was successful: ${JSON.stringify(response)}`);
        },
        error: (err) => {
            console.log(JSON.stringify(err));
        }
      });
  };

  $.ajax({
    method: "GET",
    url: "/articles",
    success: (response) => {
        console.log(`Get articles was successful: ${JSON.stringify(response)}`);
    },
    error: (err) => {
        console.log(JSON.stringify(err));
    }
  });

  //set up scrape article callbacks for clicks on scrape link and btnscrape 
  $("a[href='/scrape']").on("click", (event) => {
      event.preventDefault();
      scrapeArticle();
  });
  $("#btnScrape").on("click", (event) => {
      event.preventDefault();
      scrapeArticle();
  });

  $(".saveBtn").on("click", () => {
    updateArticle(articleId, true);
  });

  $(".unsaveBtn").on("click", () => {
      updateArticle(articleId, false);
  });

  $(".card").on("click", () => {
    let id = $(this).attr("id");
    $.ajax({
      method: "GET",
      url: `/articles/${id}`,
      success: (response) => {
        console.log(`Successfully got notes: ${JSON.stringify(response)}`);
      },
      error: (err) => {
        console.log(JSON.stringify(err));
      }
    });
  });

});