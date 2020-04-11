$(document).ready(function(){

    // CONFIGURATION
    var url_base_api = "http://localhost:8080/api/members";
    var max_churripuntos = 5;
    // END CONFIGURATION

    var limit_churripuntos_reached = false;
    var members_reached_limit = [];

    $("#btn_create_member").click(function() {
        var member = createMember();
        saveMember(member);
        $("#div_form_add_member").hide();
    });

    $("#div_button_add_member").click(function() {
        $("#name").val("");
        $("#div_form_add_member").show();
        $("#name").focus();
    });

    $("#btn_cancel_create_member").click(function() {
        $("#div_form_add_member").hide();
    });

    $(document).on("click", ".delete_member" , function() {
        var name = $(this).parent().find("span.name").html();
        deleteMember(name);
    });

    $(document).on("click", ".add_churripunto" , function() {
        var name = $(this).parent().find("span.name").html();
        var points = parseInt($(this).parent().parent().find(".hidden_points").val());
        if (points < max_churripuntos) {
            var member = {
                name: name,
                points: (points + 1)
            };
            updateChurripuntos(member);
        }
    });

    $(document).on("click", ".delete_churripunto" , function() {
        var name = $(this).parent().find("span.name").html();
        var points = parseInt($(this).parent().parent().find(".hidden_points").val());
        if (points > 0) {
            var member = {
                name: name,
                points: (points - 1)
            };
            updateChurripuntos(member);
        }
    });

    function saveMember(member) {
        $.ajax({
          type: "POST",
          url: url_base_api,
          data: JSON.stringify(member),
          beforeSend: function(xhr){xhr.setRequestHeader('Content-Type', 'application/json');},
          success: function (data){
            loadMemberList();
          },
          dataType: "json"
        });
    }

    function deleteMember(name) {
        $.ajax({
              type: "POST",
              url: url_base_api + "/delete/" + name,
              beforeSend: function(xhr){xhr.setRequestHeader('Content-Type', 'application/json');},
              success: function (data){
                loadMemberList();
              },
              dataType: "json"
         });
    }

    function updateChurripuntos(member) {
        $.ajax({
            type: "POST",
            url: url_base_api + '/edit/' + member.name,
            data: JSON.stringify(member),
            beforeSend: function(xhr){xhr.setRequestHeader('Content-Type', 'application/json');},
            success: function (data){
                loadMemberList();
            },
            dataType: "json"
        });
    }

    function createMember() {
        var name = $("#name").val();
        var points = 0;
        var member = {
            name: name,
            points: points
        };
        return member;
    }

    function loadMemberList() {
        limit_churripuntos_reached = false;
        members_reached_limit = [];
        $.get(url_base_api, function( data ) {
            $( "#churripuntos-list" ).html("");
            data.member.forEach(printMember);
            displayChurripuntosImage();
        });
    }

    function displayChurripuntosImage() {
        if (limit_churripuntos_reached) {
            console.log(members_reached_limit);
            $("#div_names_reached_limit").html(members_reached_limit.join(", "));
            $("#div_img_churripuntos").show();
        } else {
            members_reached_limit = [];
            $("#div_names_reached_limit").html("");
            $("#div_img_churripuntos").hide();
        }
    }

    function printMember(item, index) {
        var html = '<div class="row justify-content-start member_row">';
        html += '<div class="col-2 member-name" id="member_id_' + index + '"><span class="delete_member" title="Delete member"><i class="fas fa-user-minus"></i></span><span class="name">' + item.name + '</span><span class="add_churripunto" title="Add Churripunto"><i class="fas fa-plus-square"></i></span><span class="delete_churripunto" title="Remove Churripunto"><i class="fas fa-minus-square"></i></span></div>';
        for (var i = 0; i < item.points; i++) {
            html += '<div class="col-2 churripunto churripunto-' + (i+1) + '"></div>';
            if (i == (max_churripuntos - 1) ) {
                limit_churripuntos_reached = true;
                if (members_reached_limit.indexOf(item.name) == -1) {
                    members_reached_limit.push(item.name);
                }
            }
        }
        html += '<input type="hidden" class="hidden_points" id="member_points_' + index + '" value="' + item.points + '" />';
        html += '</div>';
        $( "#churripuntos-list" ).append(html);
    }

    loadMemberList();
});