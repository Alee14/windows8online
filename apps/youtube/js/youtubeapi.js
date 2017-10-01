$(document).ready(function()
    {
    $(".search_input").focus();
    $(".search_input").keyup(function() 
    {
     
     $("#video").html('');
    var search_input = $(this).val();
    var keyword= encodeURIComponent(search_input);
     
    var yt_url='http://gdata.youtube.com/feeds/api/videos?q='+keyword+'&format=5&max-results=12&v=2&alt=jsonc'; 
     
     
    $.ajax({
    type: "GET",
    url: yt_url,
    dataType:"jsonp",
    success: function(response)
    {
    if(response.data.items)
    {
     
     
     
    $.each(response.data.items, function(i,data)
    {
    var video_id=data.id;
    var video_title=data.title;
    var video_viewCount=data.viewCount;
     
     
     
    var video_frame="<img src='http://i.ytimg.com/vi/"+video_id+"/mqdefault.jpg'/>";
    var final="<div class='result'><div>"+video_frame+"</div><a href='http://www.youtube.com/embed/"+video_id+"' target='viewer' id='title' onclick='showframe()' title='"+video_title+"'>"+video_title+"</a></div>";
     
    $("#video").append(final);
     
    });
     
     
    }
    else
    {
    $("#video").html("<div id='no'>No video found.</div>");
    }
    }
     
    });
    });    
    });
     