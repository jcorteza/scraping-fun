$("document").ready(() => {
  $(".collapsible").collapsible();
  $(".modal").modal();
  // define funcion expression scrapeArticles for POST ajax call
  const scrapeArticle = () => {
    $.ajax({
        method: "POST",
        url: "/articles",
        success: (response) => {
            console.log(response.success);
            location.reload();
        },
        error: (err) => {
            console.log(err.error);
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
            console.log(response.success);
        },
        error: (err) => {
            console.log(err.error);
        }
      });
  };

const deleteNote = function(noteId) {
  $.ajax({
    method: "DELETE",
    url: `/notes/${noteId}`,
    success: (response) => {
        console.log(response.success);
    },
    error: (err) => {
        console.log(err.error);
    }
  });
};

  // deletes any unsaved articles
  $.ajax({
    method: "DELETE",
    url: "/articles",
    success: (response) => {
        console.log(response.success);
    },
    error: (err) => {
        console.log(err.error);
    }
  });

  // pulls any remaining articles from the database
  $.ajax({
    method: "GET",
    url: "/articles",
    error: (err) => {
        console.log(err.error);
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

  //updated article saved status to true
  $("a.saveBtn").on("click", function() {
    let classes = $(this).attr("class");
    let articleId = $(this).parent("div[class='card']").attr("id");
    $(this).text("Saved");
    $(this).attr("class", `${classes} disabled`);
    updateArticle(articleId, true);
  });

  //updates article saved status to false
  $(".unsaveArticle").on("click", function() {
      let articleId = $(this).parent("div.savedCard").attr("id");
      $(`#${articleId}`).remove();
      updateArticle(articleId, false);
      $(this)
        .parent("div.savedCard")
        .children("ul.collapsible")
        .children("li")
        .children("div.collapsible-body")
        .children("div.noteCard")
        .each(function() {
            let noteId = $(this).attr("id");
            deleteNote(noteId);
        });
  });

  //on click of .submitNote ajax used to post new note to db
  $("#submitNote").on("click", function(event) {
    event.preventDefault();
    let title = $("#noteTitle").val().trim();
    let body = $("#noteBody").val().trim();
    let articleId = $(this).attr("data-articleId");
    $.ajax({ 
      method: "POST",
      url: `/articles/${articleId}`,
      data: {
          title: title,
          body: body
      },
      success: (article) => {
        console.log(JSON.stringify(article));
        location.reload();
      },
      error: (err) => {
        console.log(err.error);
      }
    });
  });

  // on click of .deletenote ajax call is made to delete note from db based on id
  $(".deleteNote").on("click", function() {
    let noteId = $(this).parent().attr("id");
    $(`#${noteId}`).remove();
    deleteNote(noteId);
  });
});