// Define the Driver interface
export interface Driver {
  id: string;
  name: string;
  team: string;
  races: number;
  wins: number;
  firstSeason: number;
}

// This file contains all drivers data
// You can paste additional drivers in this array in the same format as the existing ones

// Defining drivers without the id field as it will be assigned when adding to the database
export const initialDrivers: Array<Omit<Driver, "id">> = [
  // Current F1 drivers data for 2025 season (first 20 already implemented elsewhere)
  {
    name: "Max Verstappen",
    team: "Red Bull Racing",
    firstSeason: 2015,
    races: 213,
    wins: 57
  },
  {
    name: "Sergio Perez",
    team: "Red Bull Racing",
    firstSeason: 2011,
    races: 267,
    wins: 6
  },
  {
    name: "Lewis Hamilton",
    team: "Mercedes",
    firstSeason: 2007,
    races: 346,
    wins: 103
  },
  {
    name: "George Russell",
    team: "Mercedes",
    firstSeason: 2019,
    races: 117,
    wins: 2
  },
  {
    name: "Charles Leclerc",
    team: "Ferrari",
    firstSeason: 2018,
    races: 143,
    wins: 5
  },
  {
    name: "Carlos Sainz",
    team: "Ferrari",
    firstSeason: 2015,
    races: 206,
    wins: 3
  },
  {
    name: "Lando Norris",
    team: "McLaren",
    firstSeason: 2019,
    races: 129,
    wins: 4
  },
  {
    name: "Oscar Piastri",
    team: "McLaren",
    firstSeason: 2023,
    races: 46,
    wins: 1
  },
  {
    name: "Fernando Alonso",
    team: "Aston Martin",
    firstSeason: 2001,
    races: 389,
    wins: 32
  },
  {
    name: "Lance Stroll",
    team: "Aston Martin",
    firstSeason: 2017,
    races: 155,
    wins: 0
  },
  {
    name: "Esteban Ocon",
    team: "Alpine",
    firstSeason: 2016,
    races: 140,
    wins: 1
  },
  {
    name: "Pierre Gasly",
    team: "Alpine",
    firstSeason: 2017,
    races: 147,
    wins: 1
  },
  {
    name: "Alexander Albon",
    team: "Williams",
    firstSeason: 2019,
    races: 98,
    wins: 0
  },
  {
    name: "Franco Colapinto",
    team: "Williams",
    firstSeason: 2024,
    races: 12,
    wins: 0
  },
  {
    name: "Yuki Tsunoda",
    team: "RB F1 Team",
    firstSeason: 2021,
    races: 87,
    wins: 0
  },
  {
    name: "Liam Lawson",
    team: "RB F1 Team",
    firstSeason: 2023,
    races: 5,
    wins: 0
  },
  {
    name: "Nico Hulkenberg",
    team: "Sauber",
    firstSeason: 2010,
    races: 214,
    wins: 0
  },
  {
    name: "Valtteri Bottas",
    team: "Sauber",
    firstSeason: 2013,
    races: 231,
    wins: 10
  },
  {
    name: "Kevin Magnussen",
    team: "Haas F1 Team",
    firstSeason: 2014,
    races: 178,
    wins: 0
  },
  {
    name: "Oliver Bearman",
    team: "Haas F1 Team",
    firstSeason: 2024,
    races: 1,
    wins: 0
  },
  
  // Paste additional drivers here in the same format
  // These will be historic F1 drivers, with correct career statistics
  { name: "Giuseppe Farina", team: "Alfa Romeo", firstSeason: 1950, races: 33, wins: 5 },
  { name: "Juan Manuel Fangio", team: "Alfa Romeo/Ferrari/Maserati/Mercedes", firstSeason: 1950, races: 51, wins: 24 },
  { name: "Luigi Fagioli", team: "Alfa Romeo", firstSeason: 1950, races: 7, wins: 1 },
  { name: "Reg Parnell", team: "Alfa Romeo", firstSeason: 1950, races: 6, wins: 0 },
  { name: "Prince Bira", team: "Maserati/Gordini", firstSeason: 1950, races: 19, wins: 0 },
  { name: "Yves Giraud-Cabantous", team: "Talbot-Lago", firstSeason: 1950, races: 13, wins: 0 },
  { name: "Louis Rosier", team: "Talbot-Lago/Ferrari", firstSeason: 1950, races: 38, wins: 0 },
  { name: "Raymond Sommer", team: "Ferrari/Talbot", firstSeason: 1950, races: 5, wins: 0 },
  { name: "Luigi Villoresi", team: "Ferrari", firstSeason: 1950, races: 31, wins: 0 },
  { name: "Alberto Ascari", team: "Ferrari", firstSeason: 1950, races: 32, wins: 13 },
  { name: "Dorino Serafini", team: "Ferrari", firstSeason: 1950, races: 1, wins: 0 },
  { name: "Peter Whitehead", team: "Ferrari", firstSeason: 1950, races: 8, wins: 0 },
  { name: "Philippe Étancelin", team: "Talbot-Lago", firstSeason: 1950, races: 12, wins: 0 },
  { name: "Johnny Claes", team: "Talbot/Gordini", firstSeason: 1950, races: 23, wins: 0 },
  { name: "Harry Schell", team: "Cooper/Maserati", firstSeason: 1950, races: 56, wins: 0 },
  { name: "José Froilán González", team: "Ferrari/Maserati", firstSeason: 1950, races: 26, wins: 2 },
  { name: "Stirling Moss", team: "Multiple teams", firstSeason: 1951, races: 66, wins: 16 },
  { name: "Onofre Marimón", team: "Maserati", firstSeason: 1951, races: 11, wins: 0 },
  { name: "Piero Taruffi", team: "Ferrari", firstSeason: 1950, races: 18, wins: 1 },
  { name: "Mike Hawthorn", team: "Ferrari", firstSeason: 1952, races: 45, wins: 3 },
  { name: "Tony Bettenhausen", team: "Kurtis Kraft", firstSeason: 1950, races: 5, wins: 0 },
  { name: "Maurice Trintignant", team: "Gordini/Ferrari/Cooper", firstSeason: 1950, races: 82, wins: 2 },
  { name: "Paul Pietsch", team: "Alfa Romeo", firstSeason: 1950, races: 3, wins: 0 },
  { name: "Tony Rolt", team: "ERA", firstSeason: 1950, races: 3, wins: 0 },
  { name: "Hans Stuck", team: "AFM", firstSeason: 1951, races: 7, wins: 0 },
  { name: "Bill Mackey", team: "Kurtis Kraft", firstSeason: 1951, races: 1, wins: 0 },
  { name: "Jack Brabham", team: "Cooper/Brabham", firstSeason: 1955, races: 126, wins: 14 },
  { name: "Tony Brooks", team: "BRM/Vanwall/Ferrari", firstSeason: 1956, races: 38, wins: 6 },
  { name: "Roy Salvadori", team: "Cooper", firstSeason: 1952, races: 47, wins: 0 },
  { name: "Luigi Musso", team: "Ferrari", firstSeason: 1953, races: 24, wins: 1 },
  { name: "Peter Collins", team: "Ferrari", firstSeason: 1952, races: 32, wins: 3 },
  { name: "Eugenio Castellotti", team: "Ferrari", firstSeason: 1955, races: 14, wins: 0 },
  { name: "Wolfgang von Trips", team: "Ferrari", firstSeason: 1957, races: 27, wins: 2 },
  { name: "Jo Bonnier", team: "Multiple teams", firstSeason: 1956, races: 104, wins: 1 },
  { name: "Phil Hill", team: "Ferrari", firstSeason: 1958, races: 48, wins: 3 },
  { name: "Graham Hill", team: "BRM/Lotus", firstSeason: 1958, races: 176, wins: 14 },
  { name: "Bruce McLaren", team: "Cooper/McLaren", firstSeason: 1958, races: 100, wins: 4 },
  { name: "Stuart Lewis-Evans", team: "Vanwall", firstSeason: 1957, races: 14, wins: 0 },
  
  // 1960s
  { name: "Jim Clark", team: "Lotus", firstSeason: 1960, races: 72, wins: 25 },
  { name: "John Surtees", team: "Ferrari", firstSeason: 1960, races: 111, wins: 6 },
  { name: "Dan Gurney", team: "Ferrari/Brabham/Eagle", firstSeason: 1959, races: 86, wins: 4 },
  { name: "Trevor Taylor", team: "Lotus", firstSeason: 1961, races: 27, wins: 0 },
  { name: "Richie Ginther", team: "Ferrari/BRM/Honda", firstSeason: 1960, races: 52, wins: 1 },
  { name: "Jackie Stewart", team: "BRM/Matra/Tyrrell", firstSeason: 1965, races: 99, wins: 27 },
  { name: "Denny Hulme", team: "Brabham/McLaren", firstSeason: 1965, races: 112, wins: 8 },
  { name: "Jochen Rindt", team: "Cooper/Lotus", firstSeason: 1964, races: 60, wins: 6 },
  { name: "Lorenzo Bandini", team: "Ferrari", firstSeason: 1961, races: 42, wins: 1 },
  { name: "Chris Amon", team: "Ferrari", firstSeason: 1963, races: 96, wins: 0 },
  { name: "Pedro Rodríguez", team: "Ferrari/BRM", firstSeason: 1963, races: 54, wins: 2 },
  { name: "Mike Spence", team: "Lotus", firstSeason: 1963, races: 36, wins: 0 },
  { name: "Bob Anderson", team: "DW Racing", firstSeason: 1963, races: 25, wins: 0 },
  { name: "Willy Mairesse", team: "Ferrari", firstSeason: 1960, races: 12, wins: 0 },
  { name: "Innes Ireland", team: "Lotus", firstSeason: 1959, races: 50, wins: 1 },
  { name: "Jackie Ickx", team: "Ferrari", firstSeason: 1966, races: 114, wins: 8 },
  { name: "Vic Elford", team: "Cooper/McLaren", firstSeason: 1968, races: 13, wins: 0 },
  { name: "Ludovico Scarfiotti", team: "Ferrari", firstSeason: 1963, races: 10, wins: 1 },
  { name: "Jean-Pierre Beltoise", team: "Matra/BRM", firstSeason: 1967, races: 86, wins: 1 },
  { name: "Piers Courage", team: "Brabham", firstSeason: 1967, races: 27, wins: 0 },
  { name: "Ronnie Peterson", team: "March/Lotus", firstSeason: 1970, races: 123, wins: 10 },
  
  // 1970s
  { name: "Emerson Fittipaldi", team: "Lotus/McLaren/Fittipaldi", firstSeason: 1970, races: 144, wins: 14 },
  { name: "Clay Regazzoni", team: "Ferrari/Williams", firstSeason: 1970, races: 132, wins: 5 },
  { name: "François Cevert", team: "Tyrrell", firstSeason: 1970, races: 47, wins: 1 },
  { name: "Niki Lauda", team: "Ferrari/Brabham/McLaren", firstSeason: 1971, races: 171, wins: 25 },
  { name: "James Hunt", team: "Hesketh/McLaren/Wolf", firstSeason: 1973, races: 92, wins: 10 },
  { name: "Jody Scheckter", team: "McLaren/Tyrrell/Wolf/Ferrari", firstSeason: 1972, races: 112, wins: 10 },
  { name: "Carlos Reutemann", team: "Brabham/Ferrari/Williams", firstSeason: 1972, races: 146, wins: 12 },
  { name: "Mario Andretti", team: "Lotus", firstSeason: 1968, races: 128, wins: 12 },
  { name: "Patrick Depailler", team: "Tyrrell/Ligier/Alfa Romeo", firstSeason: 1972, races: 95, wins: 2 },
  { name: "Vittorio Brambilla", team: "March", firstSeason: 1974, races: 74, wins: 1 },
  { name: "Tom Pryce", team: "Shadow", firstSeason: 1974, races: 42, wins: 0 },
  { name: "Jean-Pierre Jarier", team: "Shadow", firstSeason: 1971, races: 134, wins: 0 },
  { name: "Hans-Joachim Stuck", team: "March/Brabham", firstSeason: 1974, races: 74, wins: 0 },
  { name: "Jacques Laffite", team: "Ligier", firstSeason: 1974, races: 176, wins: 6 },
  { name: "Gilles Villeneuve", team: "Ferrari", firstSeason: 1977, races: 67, wins: 6 },
  { name: "Didier Pironi", team: "Tyrrell/Ferrari", firstSeason: 1978, races: 72, wins: 3 },
  { name: "John Watson", team: "Brabham/McLaren", firstSeason: 1973, races: 152, wins: 5 },
  { name: "Alan Jones", team: "Williams", firstSeason: 1975, races: 116, wins: 12 },
  { name: "Jean-Pierre Jabouille", team: "Renault", firstSeason: 1975, races: 49, wins: 2 },
  { name: "Patrick Tambay", team: "Ferrari", firstSeason: 1977, races: 114, wins: 2 },
  { name: "Gunnar Nilsson", team: "Lotus", firstSeason: 1976, races: 31, wins: 1 },
  { name: "Rene Arnoux", team: "Renault/Ferrari", firstSeason: 1978, races: 149, wins: 7 },
  { name: "Elio de Angelis", team: "Lotus", firstSeason: 1979, races: 108, wins: 2 },
  
  // 1980s
  { name: "Nelson Piquet", team: "Brabham/Williams/Lotus/Benetton", firstSeason: 1978, races: 204, wins: 23 },
  { name: "Alain Prost", team: "McLaren/Ferrari/Williams", firstSeason: 1980, races: 199, wins: 51 },
  { name: "Keke Rosberg", team: "Williams", firstSeason: 1978, races: 114, wins: 5 },
  { name: "Ayrton Senna", team: "Toleman/Lotus/McLaren", firstSeason: 1984, races: 161, wins: 41 },
  { name: "Nigel Mansell", team: "Lotus/Williams/Ferrari/McLaren", firstSeason: 1980, races: 187, wins: 31 },
  { name: "Gerhard Berger", team: "Ferrari/McLaren", firstSeason: 1984, races: 210, wins: 10 },
  { name: "Michele Alboreto", team: "Ferrari", firstSeason: 1981, races: 194, wins: 5 },
  { name: "Riccardo Patrese", team: "Brabham/Williams", firstSeason: 1977, races: 256, wins: 6 },
  { name: "Derek Warwick", team: "Toleman/Renault/Brabham", firstSeason: 1981, races: 147, wins: 0 },
  { name: "Andrea de Cesaris", team: "Multiple teams", firstSeason: 1980, races: 208, wins: 0 },
  { name: "Marc Surer", team: "Brabham/Arrows", firstSeason: 1979, races: 82, wins: 0 },
  { name: "Thierry Boutsen", team: "Williams", firstSeason: 1983, races: 164, wins: 3 },
  { name: "Eddie Cheever", team: "Alfa Romeo/Renault", firstSeason: 1978, races: 132, wins: 0 },
  { name: "Stefan Johansson", team: "Ferrari/McLaren", firstSeason: 1980, races: 79, wins: 0 },
  { name: "Martin Brundle", team: "Multiple teams", firstSeason: 1984, races: 158, wins: 0 },
  { name: "Stefan Bellof", team: "Tyrrell", firstSeason: 1984, races: 20, wins: 0 },
  { name: "Johnny Dumfries", team: "Lotus", firstSeason: 1986, races: 15, wins: 0 },
  { name: "Alessandro Nannini", team: "Benetton", firstSeason: 1986, races: 76, wins: 1 },
  { name: "Ivan Capelli", team: "March/Ferrari", firstSeason: 1985, races: 98, wins: 0 },
  { name: "Jean Alesi", team: "Ferrari", firstSeason: 1989, races: 201, wins: 1 },
  { name: "Johnny Herbert", team: "Benetton/Sauber/Stewart", firstSeason: 1989, races: 161, wins: 3 },
  { name: "Pierluigi Martini", team: "Minardi", firstSeason: 1984, races: 118, wins: 0 },
  { name: "Satoru Nakajima", team: "Lotus/Tyrrell", firstSeason: 1987, races: 74, wins: 0 },
  { name: "Maurício Gugelmin", team: "March/Jordan", firstSeason: 1988, races: 74, wins: 0 },
  
  // 1990s
  { name: "Michael Schumacher", team: "Jordan/Benetton/Ferrari/Mercedes", firstSeason: 1991, races: 306, wins: 91 },
  { name: "Damon Hill", team: "Williams/Arrows/Jordan", firstSeason: 1992, races: 115, wins: 22 },
  { name: "Jacques Villeneuve", team: "Williams/BAR", firstSeason: 1996, races: 163, wins: 11 },
  { name: "Mika Häkkinen", team: "McLaren", firstSeason: 1991, races: 161, wins: 20 },
  { name: "David Coulthard", team: "Williams/McLaren/Red Bull", firstSeason: 1994, races: 246, wins: 13 },
  { name: "Rubens Barrichello", team: "Jordan/Ferrari/Honda/Brawn", firstSeason: 1993, races: 322, wins: 11 },
  { name: "Eddie Irvine", team: "Jordan/Ferrari/Jaguar", firstSeason: 1993, races: 147, wins: 4 },
  { name: "Heinz-Harald Frentzen", team: "Sauber/Williams/Jordan", firstSeason: 1994, races: 156, wins: 3 },
  { name: "Olivier Panis", team: "Ligier/Prost", firstSeason: 1994, races: 157, wins: 1 },
  { name: "Ukyo Katayama", team: "Tyrrell", firstSeason: 1992, races: 95, wins: 0 },
  { name: "Gianni Morbidelli", team: "Minardi/Ferrari/Footwork", firstSeason: 1990, races: 67, wins: 0 },
  { name: "Christian Fittipaldi", team: "Minardi/Footwork", firstSeason: 1992, races: 40, wins: 0 },
  { name: "JJ Lehto", team: "Sauber/Benetton", firstSeason: 1989, races: 62, wins: 0 },
  { name: "Pedro Lamy", team: "Lotus/Minardi", firstSeason: 1993, races: 32, wins: 0 },
  { name: "Jos Verstappen", team: "Benetton/Arrows", firstSeason: 1994, races: 107, wins: 0 },
  { name: "Karl Wendlinger", team: "Sauber", firstSeason: 1991, races: 41, wins: 0 },
  { name: "Ralf Schumacher", team: "Jordan/Williams/Toyota", firstSeason: 1997, races: 180, wins: 6 },
  { name: "Jarno Trulli", team: "Renault/Toyota", firstSeason: 1997, races: 252, wins: 1 },
  { name: "Giancarlo Fisichella", team: "Jordan/Renault/Force India/Ferrari", firstSeason: 1996, races: 229, wins: 3 },
  { name: "Pedro Diniz", team: "Forti/Arrows/Sauber", firstSeason: 1995, races: 98, wins: 0 },
  { name: "Juan Pablo Montoya", team: "Williams/McLaren", firstSeason: 2001, races: 94, wins: 7 },
  
  // 2000s
  { name: "Jenson Button", team: "Williams/Benetton/BAR/Honda/Brawn/McLaren", firstSeason: 2000, races: 306, wins: 15 },
  { name: "Nick Heidfeld", team: "Prost/Sauber/BMW", firstSeason: 2000, races: 183, wins: 0 },
  { name: "Kimi Räikkönen", team: "Sauber/McLaren/Ferrari/Lotus/Alfa Romeo", firstSeason: 2001, races: 349, wins: 21 },
  { name: "Fernando Alonso", team: "Minardi/Renault/McLaren/Ferrari/Alpine/Aston Martin", firstSeason: 2001, races: 402, wins: 32 },
  { name: "Mark Webber", team: "Minardi/Jaguar/Williams/Red Bull", firstSeason: 2002, races: 215, wins: 9 },
  { name: "Felipe Massa", team: "Sauber/Ferrari/Williams", firstSeason: 2002, races: 269, wins: 11 },
  { name: "Takuma Sato", team: "Jordan/BAR/Super Aguri", firstSeason: 2002, races: 90, wins: 0 },
  { name: "Cristiano da Matta", team: "Toyota", firstSeason: 2003, races: 28, wins: 0 },
  { name: "Justin Wilson", team: "Minardi/Jaguar", firstSeason: 2003, races: 16, wins: 0 },
  { name: "Christian Klien", team: "Jaguar/Red Bull", firstSeason: 2004, races: 49, wins: 0 },
  { name: "Vitantonio Liuzzi", team: "Red Bull/Toro Rosso/Force India/HRT", firstSeason: 2005, races: 80, wins: 0 },
  { name: "Scott Speed", team: "Toro Rosso", firstSeason: 2006, races: 28, wins: 0 },
  { name: "Robert Kubica", team: "BMW Sauber/Renault/Williams", firstSeason: 2006, races: 99, wins: 1 },
  { name: "Adrian Sutil", team: "Spyker/Force India/Sauber", firstSeason: 2007, races: 128, wins: 0 },
  { name: "Heikki Kovalainen", team: "Renault/McLaren/Lotus", firstSeason: 2007, races: 111, wins: 1 },
  { name: "Sebastian Vettel", team: "BMW Sauber/Toro Rosso/Red Bull/Ferrari/Aston Martin", firstSeason: 2007, races: 300, wins: 53 },
  { name: "Lewis Hamilton", team: "McLaren/Mercedes", firstSeason: 2007, races: 354, wins: 104 },
  { name: "Kazuki Nakajima", team: "Williams", firstSeason: 2007, races: 36, wins: 0 },
  { name: "Nelson Piquet Jr.", team: "Renault", firstSeason: 2008, races: 28, wins: 0 },
  { name: "Sébastien Bourdais", team: "Toro Rosso", firstSeason: 2008, races: 27, wins: 0 },
  { name: "Kamui Kobayashi", team: "Toyota/Sauber/Caterham", firstSeason: 2009, races: 75, wins: 0 },
  { name: "Jaime Alguersuari", team: "Toro Rosso", firstSeason: 2009, races: 46, wins: 0 },
  
  // 2010s
  { name: "Nico Hülkenberg", team: "Williams/Force India/Sauber/Renault/Racing Point/Haas", firstSeason: 2010, races: 229, wins: 0 },
  { name: "Vitaly Petrov", team: "Renault/Caterham", firstSeason: 2010, races: 57, wins: 0 },
  { name: "Bruno Senna", team: "HRT/Renault/Williams", firstSeason: 2010, races: 46, wins: 0 },
  { name: "Pastor Maldonado", team: "Williams/Lotus", firstSeason: 2011, races: 95, wins: 1 },
  { name: "Sergio Perez", team: "Sauber/McLaren/Force India/Racing Point/Red Bull", firstSeason: 2011, races: 264, wins: 7 },
  { name: "Paul di Resta", team: "Force India", firstSeason: 2011, races: 59, wins: 0 },
  { name: "Daniel Ricciardo", team: "HRT/Toro Rosso/Red Bull/Renault/McLaren", firstSeason: 2011, races: 235, wins: 8 },
  { name: "Jean-Eric Vergne", team: "Toro Rosso", firstSeason: 2012, races: 58, wins: 0 },
  { name: "Charles Pic", team: "Marussia/Caterham", firstSeason: 2012, races: 39, wins: 0 },
  { name: "Jules Bianchi", team: "Marussia", firstSeason: 2013, races: 34, wins: 0 },
  { name: "Valtteri Bottas", team: "Williams/Mercedes/Alfa Romeo", firstSeason: 2013, races: 232, wins: 10 },
  { name: "Esteban Gutiérrez", team: "Sauber/Haas", firstSeason: 2013, races: 59, wins: 0 },
  { name: "Max Chilton", team: "Marussia", firstSeason: 2013, races: 35, wins: 0 },
  { name: "Kevin Magnussen", team: "McLaren/Renault/Haas", firstSeason: 2014, races: 191, wins: 0 },
  { name: "Marcus Ericsson", team: "Caterham/Sauber", firstSeason: 2014, races: 97, wins: 0 },
  { name: "Felipe Nasr", team: "Sauber", firstSeason: 2015, races: 39, wins: 0 },
  { name: "Max Verstappen", team: "Toro Rosso/Red Bull", firstSeason: 2015, races: 210, wins: 64 },
  { name: "Carlos Sainz", team: "Toro Rosso/Renault/McLaren/Ferrari/Williams", firstSeason: 2015, races: 183, wins: 2 },
  { name: "Jolyon Palmer", team: "Renault", firstSeason: 2016, races: 35, wins: 0 },
  { name: "Pascal Wehrlein", team: "Manor/Sauber", firstSeason: 2016, races: 39, wins: 0 },
  { name: "Esteban Ocon", team: "Manor/Force India/Alpine/Haas", firstSeason: 2016, races: 146, wins: 1 },
  { name: "Stoffel Vandoorne", team: "McLaren", firstSeason: 2016, races: 41, wins: 0 },
  { name: "Lance Stroll", team: "Williams/Racing Point/Aston Martin", firstSeason: 2017, races: 170, wins: 0 },
  { name: "Pierre Gasly", team: "Toro Rosso/Red Bull/AlphaTauri/Alpine", firstSeason: 2017, races: 167, wins: 1 },
  { name: "Brendon Hartley", team: "Toro Rosso", firstSeason: 2017, races: 25, wins: 0 },
  { name: "Charles Leclerc", team: "Sauber/Ferrari", firstSeason: 2018, races: 146, wins: 7 },
  { name: "Sergey Sirotkin", team: "Williams", firstSeason: 2018, races: 21, wins: 0 },
  { name: "Lando Norris", team: "McLaren", firstSeason: 2019, races: 123, wins: 3 },
  { name: "Alexander Albon", team: "Toro Rosso/Red Bull/Williams", firstSeason: 2019, races: 109, wins: 0 },
  { name: "George Russell", team: "Williams/Mercedes", firstSeason: 2019, races: 123, wins: 3 },
  { name: "Antonio Giovinazzi", team: "Sauber/Alfa Romeo", firstSeason: 2017, races: 62, wins: 0 },
  
  // 2020s
  { name: "Nicholas Latifi", team: "Williams", firstSeason: 2020, races: 61, wins: 0 },
  { name: "Jack Aitken", team: "Williams", firstSeason: 2020, races: 1, wins: 0 },
  { name: "Pietro Fittipaldi", team: "Haas", firstSeason: 2020, races: 2, wins: 0 },
  { name: "Yuki Tsunoda", team: "AlphaTauri/Racing Bulls", firstSeason: 2021, races: 97, wins: 0 },
  { name: "Mick Schumacher", team: "Haas", firstSeason: 2021, races: 43, wins: 0 },
  { name: "Nikita Mazepin", team: "Haas", firstSeason: 2021, races: 21, wins: 0 },
  { name: "Guanyu Zhou", team: "Alfa Romeo", firstSeason: 2022, races: 64, wins: 0 },
  { name: "Nyck de Vries", team: "AlphaTauri", firstSeason: 2022, races: 11, wins: 0 },
  { name: "Oscar Piastri", team: "McLaren", firstSeason: 2023, races: 48, wins: 2 },
  { name: "Logan Sargeant", team: "Williams", firstSeason: 2023, races: 46, wins: 0 },
  { name: "Liam Lawson", team: "AlphaTauri/Racing Bulls", firstSeason: 2023, races: 6, wins: 0 },
  { name: "Oliver Bearman", team: "Haas", firstSeason: 2024, races: 2, wins: 0 },
  { name: "Franco Colapinto", team: "Williams", firstSeason: 2024, races: 8, wins: 0 },
  { name: "Kimi Antonelli", team: "Mercedes", firstSeason: 2025, races: 1, wins: 0 },
  { name: "Jack Doohan", team: "Alpine", firstSeason: 2025, races: 1, wins: 0 },
  { name: "Isack Hadjar", team: "Racing Bulls", firstSeason: 2025, races: 1, wins: 0 },
  { name: "Gabriel Bortoleto", team: "Sauber", firstSeason: 2025, races: 1, wins: 0 },
  // You can paste more drivers here - they need to have the same structure
  // as the examples above (name, team, firstSeason, races, wins)
];

// This makes the data available for importing elsewhere in the app
export default initialDrivers; 