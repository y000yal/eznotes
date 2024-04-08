$(document).ready(function () {
  function getNotes() {
    chrome.storage.local.get(["notes"], function (result) {
      if (result.notes) {
        let allNotes = result.notes;
        allNotes.sort(function (a, b) {
          let aid = a.id;
          let bid = b.id;
          if (aid > bid) {
            return -1;
          } else if (aid < bid) {
            return 1;
          }
          return 0;
        });
        $(allNotes).each(function (key, index) {
          var show = key == 0 && "show";
          var list =
            '<div class="col-12">\
          <div class="accordion" id="note-id-' +
            index.id +
            '">\
            <div class="accordion-item">\
              <div class="accordion-header" id="panelsStayOpen-heading-' +
            index.id +
            '">\
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse-' +
            index.id +
            '" aria-expanded="false" aria-controls="panelsStayOpen-collapse-' +
            index.id +
            '">\
              <h6 contenteditable style="width:80%; outline-width: 0 !important;"  class="nt-' +
            index.id +
            '">\
                   ' +
            index.title +
            '  \
              </h6>\
                </button>\
              </div>\
              <div id="panelsStayOpen-collapse-' +
            index.id +
            '" class="accordion-collapse collapse ' +
            show +
            '" aria-labelledby="panelsStayOpen-heading-' +
            index.id +
            '">\
                <div class="accordion-body nb-' +
            index.id +
            '" contenteditable>\
                ' +
            index.content +
            '  \
                </div>\
                <div class="d-flex m-2 gap-2" data-key = "' +
            index.id +
            '">\
                <button class="btn btn-outline-primary btn-sm update-note"><i class="fa fa-save"></i></button>\
                <button class="btn btn-outline-danger btn-sm delete-note" data-bs-toggle="modal" data-bs-target="#deleteNoteModal"><i class="fa fa-trash-can">Save</i></button>\
              </div>\
              </div>\
            </div>\
          </div>\
        </div>';
          var listContainer = $("#note-list");
          $(listContainer).append(list);
        });
      }
    });
  }
  getNotes(); //call to load all notes
  //utility function to call modal
  function closeModal(modalName) {
    $(`#${modalName}`).modal("hide");
  }
  //save new note
  $("#save-note").on("click", () => {
    const newNote = {
      id: 0,
      title: $(".modal-title").text(),
      content: $("#note-area").text(),
    };
    chrome.storage.local.get(["notes"], function (result) {
      const allNotes = result.notes;
      if (allNotes?.length > 0) {
        let latestNote = allNotes.reverse()[0];
        newNote.id = latestNote.id + 1;
        console.log("new note", newNote);
        allNotes.push(newNote);
      }

      chrome.storage.local.set({
        notes: allNotes?.length > 0 ? allNotes : [newNote],
      });
      var listContainer = $("#note-list");
      $(listContainer).empty();
      getNotes();
      $(".modal-title").empty().text("Title");
      $("#note-area").empty().text("Start Typing");
      closeModal("exampleModal");
    });
  });
  //update note
  $(document).on("click", ".update-note", function () {
    var key = $(this).parent().data("key");
    var title = $(`.nt-${key}`).html();
    var content = $(`.nb-${key}`).html();
    chrome.storage.local.get(["notes"], function (result) {
      const allNotes = result.notes;
      var update = allNotes.find((e) => e.id == key);
      update.content = content;
      update.title = title;
      chrome.storage.local.set({ notes: allNotes });
    });
  });
  //delete note
  $(document).on("click", ".delete-note", function () {
    $("#deleteNoteModal").attr("data-delete-key", $(this).parent().data("key"));
  });

  $("#confirm-delete").on("click", () => {
    var key = $("#deleteNoteModal").attr("data-delete-key");
    chrome.storage.local.get(["notes"], function (result) {
      const allNotes = result.notes;
      var filteredNotes = allNotes.filter(function (el) {
        return el.id != key;
      });
      chrome.storage.local.set({ notes: filteredNotes });
      $(`#note-id-${key}`).parent().remove();
      closeModal("deleteNoteModal");
    });
  });
  $(document).on("keypress", ".accordion-button", function (e) {
    if (e.keyCode == 32) {
      var val = $(this).children().find("h6").text();
      $(this)
        .children()
        .find("h6")
        .text(val + " ");
    }
  });
});
