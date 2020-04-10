$(document).ready(function(){

    $("#btn_create_member").click(function() {
        var member = createMember();
        saveMember(member);
    });

    function saveMember(member) {1
        $.ajax({
          type: "POST",
          url: "http://localhost:8080/api/members",
          data: JSON.stringify(member),
          beforeSend: function(xhr){xhr.setRequestHeader('Content-Type', 'application/json');},
          success: function (data){
            console.log(data);
          },
          dataType: "json"
        });
    }

    function createMember() {
        var name = $("#name").val();
        var points = $("#points").val();
        var member = {
            name: name,
            points: points
        };
        console.log(member);
        return member;
    }

    function loadMemberList() {
        $.get( "http://localhost:8080/api/members", function( data ) {
          $( "#churripuntos-list" ).html( data );
          console.log( "Load was performed." );
          console.log(data);
        });
    }

    loadMemberList();
});