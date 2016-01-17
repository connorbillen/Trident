# Trident
Combining the joys of SickBeard, CouchPotato, and Headphones into one happy, seamless interface.

	[ ] Trident v1.0
    	[ ] TV Shows -- BTN
        	[ ] Create SickBeard frontend
        	[ ] Replace SickBeard search/add functionality
        	[ ] Replace SickBeard post-processing functionality
	    [ ] Movies -- PTP
        	[x] Create CouchPotato frontend
        	[ ] Replace CouchPotato search/add functionality
        	[ ] Replace CouchPotato post-processing functionality
    	[ ] Music -- What.CD
        	[x] Create Headphones frontend
        	[ ] Replace Headphones search/add functionality
     		[ ] Replace Headphones post-processing functionality
    	[ ] Player
        	[ ] Replace Plex management (Edit/Destroy) functionality
        	[ ] Replace basic Plex playing functionality (HTML5 mp4, flac)
	        [ ] Replace Plex transcoding (ffmpeg)


Automating the process of acquiring media for a home theather is a hot topic in software development, so a lot of products have sprung forward trying to fill every possible nook and cranny that can possible be scripted. Many of these utilities are made with the mentality of leaving them designed in an open and generic enough way that any source for media possible can be used (UseNet/Torrents). Unfortunately, this can sometimes create a fragmented process that isn't entirely efficient and may not work out-of-the-box for some users.

Trident is created with a different mentality; limit the sources and create specific instruction sets to interact with those sources. Each process, whether it be querying for a TV Show or scraping for a new release, is catered to the source, thus providing a much more fluent overall experience. 

Initial supported sources for media until post v1.0 will be as follows:<br>
<b>Music</b> - What.CD<br>
<b>TV Shows</b> - BroadcastTheNet<br>
<b>Movies</b> - PassThePopcorn<br>

Development will initially begin as creating a unified front-end for three popular media snatching applications: SickBeard, CouchPotato, and Headphones. After a basic singular interface has been finished, each piece of functionality that the utility software provides will be replaced, starting with searching for media and adding media to the torrent client and finishing with the post-processing functions.

In the long-term, Trident will hopefully supply basic functionality in terms of managing the accessibility and viewing of content on the server, ending with a 1.0 release that provides a complete media center experience in a single package.
