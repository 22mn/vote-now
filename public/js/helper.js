
// send poll to server
// form will only submit selected option 
// *to include all options* 

function newPoll(url,dataJson){
    $.ajax({
        contentType:"application/json; charset=utf-8",
        async: true,
        url: url,
        type:"post",
        dataType: "json",
        data : JSON.stringify(dataJson),

        success: function(data,status){
          console.log("Submitted!");
          location.reload();      // refresh page for just created poll
          
        },
        failure: function(data){
          console.log("Failed!");
        },
        error : function(data){
          console.log("Error!");
        }      
      });
}

// poll-heading panels
function pollPanel(target,id,topic){
    for (var i=0; i<topic.length;i++){
        $(target).prepend("<div class='panel panel-default'>"+
        "<div class='panel-heading'><div class='container'><div class='col-xs-7'><a href='/poll/"+
        id[i]+"'>"+topic[i]+"</a></div><div class='col-xs-5'><span class='del'><a href='drop/"+id[i]
        +"'><span class='glyphicon glyphicon-trash'></span>&nbsp;delete</a></span></div></div></div>");
    }
}
// polls home page panel 
function pollPanelNew(target,id,topic,dname){
    for (var i=0; i<topic.length;i++){
        $(target).prepend("<div class='panel panel-default'>"+
        "<div class='panel-heading'><div class='container'><div class='col-xs-7'><span class='pro-val'><a href='/poll/"+
        id[i]+"'>"+topic[i]+"</a></span></div><div class='col-xs-5'><span class='plate'><span class='pal-lab'>created by : </span><span class='pal-val'><a target='_blank' href='https://twitter.com/"+dname[i]
        +"'>"+dname[i]+"</a></span></span></div></div></div></div>");
    }
}

// draw chart by poll-title and options
function chart(id,topic,options,counts){
    var ctx = document.getElementById(id).getContext('2d');
    var myChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: options,
        
        datasets: [{
            data: counts,
            backgroundColor: ["#ff33cc","#9966ff","#00ff00","#0099ff","#e6e600","#ff0066","#7575a3","#00e6e6","#999966","#669999"]
        }]
    },
  options:{
        responsive:false,
        maintainAspectRatio:false,
        title: {
            display: false,
            text : topic
        }
    }
});
}

//start up api call
function apiCall(url){
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
    })
    .done(function() {
        console.log("success");
    })
    .fail(function() {
        console.log("error");
    })    
}

// radio options for #form2
function check(names){
    for (var i=0; i < names.length;i++){
        
        $("#form2").append("<label class='radio-inline'><input type='radio' name='option' value='"+
            names[i]+"'>"+names[i]+"</label>");
        if (i === names.length-1){
            $("#form2").append("<br><br><br>");
            }
        }
        
    }

// owner info
$('#info').popover({title: "<span id='siteInfo'>A <a href='https://www.freecodecamp.com/mgjean' target='_blank'>MGJEAN </a>Site.</span>",
        content: "<span id='siteWish'>Good day amigos!</span>",html:true,placement:"left"});