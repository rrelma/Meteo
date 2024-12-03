		var dt=new Date;
		var hour=dt.getHours();
		hour=hour.toString().padStart(2,'0');
		var minute=dt.getMinutes();
		var minute=minute.toString().padStart(2,'0');
		numday=dt.getDay();
		var namdays=['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		var day=namdays[numday];
		var date=day+", "+hour+":"+minute;


		var z=dt.getHours();

		//feels like
		
		document.getElementsByClassName("feels")[1].innerHTML=date;
		

		//create 12 div hours

		const m=document.getElementsByClassName("meteo")[0];

		const x=document.getElementsByClassName("byhours")[0];


		for(var i=0;i<12;i++){
			var a=document.createElement("div");
			a.className="hourly";

			var b= document.createElement("p");
			b.className="currhours";

			var c=document.createElement("img");
			c.className="sunhour";

			var d=document.createElement("p");
			d.className="hourlydegre margin5";

			var e=document.createElement("p");
			e.className="pluie";

			a.appendChild(b);
			a.appendChild(c);
			a.appendChild(d);
			a.appendChild(e);

			x.appendChild(a);
			
			//jibo 7eto f byhours li mor meteo

			document.body.insertBefore(x,m.nextSibling);

		}

		//cree 7 days 

		const days=document.getElementsByClassName("bydays")[0];

		for(var i=0;i<7;i++){

			var f=document.createElement("div");
			f.className="daybyday";

			var g=document.createElement("p");
			g.className="day";

			var h=document.createElement("p");
			h.className="rainpr";

			var j=document.createElement("img");
			j.className="sundaily";

			var k=document.createElement("p");
			k.className="max";

			var l=document.createElement("p");
			l.className="min";

			f.appendChild(g);
			f.appendChild(h);
			f.appendChild(j);
			f.appendChild(k);
			f.appendChild(l);

			days.appendChild(f);

			//7ethom f bydays lmor byhours

			document.body.insertBefore(days,x.nextSibling);

		}




		


		navigator.geolocation.getCurrentPosition(function(position) {
			var lat=position.coords.latitude;
			var lon=position.coords.longitude;

			var url="https://api.open-meteo.com/v1/dwd-icon?latitude="+lat+"&longitude="+lon+"&current=temperature_2m,apparent_temperature,weather_code&hourly=temperature_2m,rain,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,rain_sum&timezone=auto";
			
			get(url);

			var url2="https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&appid=30953ff98c9ba6ac1a62ff7236d67714";
			//nominatim

			getcity(url2);

		})

		

		function get(x) {


			const donne=new XMLHttpRequest();
			donne.open("GET",x);

			donne.onload=function() {
				var data=JSON.parse(donne.response);

				//week days starting on current

				document.getElementsByClassName("day")[0].innerHTML="Today";


				for(var i=1;i<7;i++){

					//ma3lish ibedi men nhar curr hit machi b7al swaye3 kybedi mn 00:00


					var x=data.daily.time[i];
					var dt=new Date(x);
					var numday=dt.getDay();
					document.getElementsByClassName("day")[i].innerHTML=namdays[numday];
				}    

				//hours current

				for(var i=0;i<12;i++){

					//z c'est l heure current starting from 0 also the api is starting from 0

					var sa3a=data.hourly.time[z+i];

					sa3a=sa3a.substring(11,16);
					document.getElementsByClassName("currhours")[i].innerHTML=sa3a ;

				}

				for(var i=0;i<12;i++){
					//starting from z which is current then plus i for futur hours degree and picture

					var hourlydegre=data.hourly.temperature_2m[z+i];
					hourlydegre=Math.floor(hourlydegre);
					document.getElementsByClassName("hourlydegre")[i].innerHTML=hourlydegre;

					var shours=data.hourly.weather_code[i+z];

					var hrspic=document.getElementsByClassName("sunhour")[i];
					if(shours>=0 && shours<=3){
						hrspic.src="sunny.png";

					}else if(shours>=45 && shours<57){
						hrspic.src="fog.png";

					}else if(shours>=61 && shours<82){
						hrspic.src="rainy.png";
					}else{
						hrspic.src="cloudy.png";
					}
				}

				//unite rain in mm

				for(var i=0;i<12;i++){

					var pluie=data.hourly.rain[z+i];
					document.getElementsByClassName("pluie")[i].innerHTML=pluie+"mm";
				}

				for(var i=0;i<7;i++){
					var maxdy=data.daily.temperature_2m_max[i];
					maxdy=Math.floor(maxdy);

					var mindy=data.daily.temperature_2m_min[i];
					mindy=Math.floor(mindy);

					document.getElementsByClassName("max")[i].innerHTML=maxdy+"°";
					document.getElementsByClassName("min")[i].innerHTML=mindy+"°";

					var codeday=data.daily.weather_code[i];

					//daily pictures

					var daypic=document.getElementsByClassName("sundaily")[i];
					if(codeday>=0 && codeday<=3){
						daypic.src="sunny.png";

					}else if(codeday>=45 && codeday<57){
						daypic.src="fog.png";

					}else if(codeday>=61 && codeday<82){
						daypic.src="rainy.png";
					}else{
						daypic.src="cloudy.png";
					}

				}

				//rain in mm daily

				for(var i=0;i<7;i++){
					var rainday=data.daily.rain_sum[i];
					document.getElementsByClassName("rainpr")[i].innerHTML=rainday+"mm";
				}

				var scurr=data.current.weather_code;
				var frstpic=document.getElementsByClassName("sunpic")[0];

				if(scurr>=0 && scurr<=3){
					//if sunny rotate the image else dont

					frstpic.src="sunny.png";
					document.getElementsByClassName("sunpic")[0].style.cssText="animation-name: rotate; animation-duration: 5s";

				}else if(scurr>=45 && scurr<57){
					frstpic.src="fog.png";

				}else if(scurr>=61 && scurr<82){
					frstpic.src="rainy.png";
				}else{
					frstpic.src="cloudy.png";
				}

				var sunrise=data.daily.sunrise[0];
                sunrise=sunrise.substring(11,16);

                var sunset=data.daily.sunset[0];
                sunset=sunset.substring(11,16);
                document.getElementsByClassName("wakeup")[0].innerHTML=sunrise;
                document.getElementsByClassName("wakeup")[1].innerHTML=sunset;
                
			var degre=data.current.temperature_2m;
			degre=Math.floor(degre);
			document.getElementsByClassName("degree")[0].innerHTML=degre+"°C";



			var flike=data.current.apparent_temperature;
			flike=Math.floor(flike);
			var max=data.daily.temperature_2m_max[0];
			var min=data.daily.temperature_2m_min[0];
			max=Math.floor(max);
			min=Math.floor(min);

			var feels=max+"°C / "+min+" °C"+" Feels like "+flike+"°C";

			document.getElementsByClassName("feels")[0].innerHTML=feels;
			document.getElementsByClassName("meteo")[0].style.cssText="display: inline-block;";
			document.getElementsByClassName("byhours")[0].style.cssText="display: flex; ";
			document.getElementsByClassName("bydays")[0].style.cssText="display: flex; ";
			document.getElementsByClassName("loading")[0].style.cssText="display:none;";
            document.getElementsByClassName("sunrisesunset")[0].style.cssText="display: flex;";


				
			}

			donne.onerror=function () {
				console.log("error");
			}
			donne.send();
		}




		function getcity(x) {

		var city=new XMLHttpRequest;

		city.open("GET",x);

		city.onload=function() {
			var data=JSON.parse(city.response);
			var cityname=data.name;
			document.getElementsByClassName("city")[0].innerHTML=cityname;

			
		}
		city.onerror=function () {
			console.log("error");
			
		}
		city.send();

		}

		




		


	
	
		