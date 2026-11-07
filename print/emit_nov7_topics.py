#!/usr/bin/env python3
"""Write the 7 November 2026 topic files. ASCII punctuation. Topic 69 uses the attached prose."""
from pathlib import Path
import re

ROOT = Path("/workspace/content/topics")
PROSE = Path("/home/ubuntu/.cursor/projects/workspace/uploads/lesson_c9a0.txt")

def write(name, text):
    p = ROOT / name
    p.write_text(text.strip() + "\n", encoding="utf-8")
    body = re.sub(r"^---\n.*?\n---\n", "", text, count=1, flags=re.S)
    # substantive words: drop links targets and the key-facts/sources tails roughly
    words = re.findall(r"[A-Za-z0-9'’]+", body)
    print(f"{name}: {len(words)} words")

write("53-captain-james-cook.md", r'''---
title: "Captain James Cook: precision, encounter, and empire"
summary: Cook's three Pacific voyages were feats of surveying. They were also meetings with people who already lived on the coasts he charted, and the third voyage ended in his death at Kealakekua Bay.
session: 2026-11-07
order: 1
tags: [history, history-of-science, geography, ships]
---
James Cook was born in Yorkshire in 1728. He learned the sea in the coal trade, then joined the Royal Navy in 1755. Before any Pacific voyage he surveyed Newfoundland. The Navy already trusted him to draw a coast so that the next ship could use the drawing.

In 1768 the Admiralty gave him Endeavour. The announced task was the transit of Venus, 3 June 1769, at Tahiti, with the astronomer Charles Green. Joseph Banks and Daniel Solander sailed to collect and classify. Cook commanded, and he surveyed. After Tahiti he opened sealed instructions to sail farther and to chart what he found. In 1769 and 1770 he charted New Zealand and the east coast of Australia. Those shores were not empty, and they were not unknown to the people who lived there. A European chart is a new record for London. It is not the first knowledge of a place.

![Cook's three Pacific voyages on a timeline](../../img/Cook_Three_Voyages_Timeline_Tufte.svg?v=1)
*Three commissions, drawn for this lesson. The first includes the Tahiti transit and the charts of New Zealand and eastern Australia. The second crosses the Antarctic Circle. The third looks for a northern passage.*

The second voyage, 1772 to 1775, in Resolution and Adventure, crossed the Antarctic Circle. Cook put an end to the hope of a green southern continent sitting in the temperate ocean. He did not claim to have seen the mainland of Antarctica.

The third voyage, 1776 to 1779, in Resolution and Discovery, searched for a passage in the north. In 1778 the ships reached Hawaii. On 14 February 1779, at Kealakekua Bay, Cook was killed as a relationship that had already turned violent broke apart. The charts stayed in the Navy's hands. So did the harder consequence: disease, weapons, and later colonial power traveled along the same routes.

Hold both parts of the man. The angles and the coastlines were careful. The encounters were not a blank page, and they were not a moral slogan in either direction. The transit itself, and the risk of getting the observers there, is the next lesson in this day's chain. Banks, who collected beside him and did not sail the second voyage, is the lesson after that.

## Sources
- Royal Museums Greenwich, "Captain James Cook: timeline," https://www.rmg.co.uk/stories/maritime-history/captain-james-cook-timeline
- Whipple Museum, Cambridge, on the quadrant stolen at Tahiti and recovered: https://www.whipplemuseum.cam.ac.uk/explore-whipple-collections/astronomy-and-empire/stolen-quadrant

## Key facts
- Cook, born 1728 in Yorkshire, joined the Royal Navy in 1755 and had already surveyed Newfoundland.
- Endeavour, 1768-1771: Tahiti transit on 3 June 1769 with Green; then charts of New Zealand and Australia's east coast, lands already inhabited.
- Second voyage, 1772-1775, crossed the Antarctic Circle and did not claim a sighting of the Antarctic mainland.
- Third voyage ended at Kealakekua Bay, Hawaii, on 14 February 1779, after relations had turned violent.
''')

write("54-joseph-banks-botanist.md", r'''---
title: "Joseph Banks: the botanist who built a network"
summary: Joseph Banks paid for collecting, sailed with Cook, presided over the Royal Society, and organized the breadfruit missions. He was not Kew's director, not the Bounty's captain, and not the American clothier.
session: 2026-11-07
order: 2
tags: [history, history-of-science, geography]
---
Joseph Banks (1743-1820) was a British naturalist with money enough to turn curiosity into cargo. In 1766 he collected in Newfoundland and Labrador. In 1768 he joined Cook on Endeavour. Daniel Solander classified. Sydney Parkinson drew. A dried plant, a label, and a drawing are a scientific record. They are a European record. People who already grew or gathered those plants had not been waiting for a London name.

Banks came home in 1771. He did not go on Cook's second voyage. In 1772 he sailed to Iceland instead. From 1778 until he died in 1820 he was president of the Royal Society. He advised King George III and had a long influence on the gardens at Kew. Influence is the right word. He was not the formal director of Kew, and this lesson will not give him that title.

He is also the organizer of the breadfruit voyages, not their captain. The plan was to move a living Pacific crop to the Caribbean as cheap food for enslaved plantation workers. The packing of living trees was ingenious. The purpose sat inside an empire that ran on forced labor. Both sentences belong in the account. The voyage itself, and the mutiny that stopped the first attempt, are told with the Bounty. The plant is told in the breadfruit lesson.

One warning about the name. Jos. A. Bank, the Baltimore clothier, is a different man and a different century. The botanist has a final s. The firm usually does not. Nothing in Banks's career is a clothing chain, and this page will not invent one.

The link back to Cook is the ship they shared in 1768. The link forward is the crate of breadfruit trees Banks wanted sent, and the American firm that only looks like his name.

## Sources
- Natural History Museum, "Joseph Banks: scientist, explorer, botanist," https://www.nhm.ac.uk/discover/joseph-banks-scientist-explorer-botanist.html
- Royal Botanic Gardens, Kew, history of the gardens: https://www.kew.org/about-us/history-of-kew
- Royal Society note on Banks: https://royalsociety.org/science-events-and-lectures/2017/09/joseph-banks/

## Key facts
- Banks (1743-1820) collected in Newfoundland and Labrador in 1766 and sailed on Endeavour in 1768 with Solander and Parkinson.
- He returned in 1771, did not join Cook's second voyage, and went to Iceland in 1772.
- President of the Royal Society 1778-1820. He advised the king and influenced Kew. He was not Kew's formal director.
- He organized the breadfruit missions. He was not captain of the Bounty. He is not the clothier Jos. A. Bank.
''')

write("55-venus-transits-1761-1769.md", r'''---
title: "The Venus transits: a worldwide ruler"
summary: The 1761 and 1769 transits turned a relative solar system into miles, badly at first and better later. No single station, and no single reduction, was the modern astronomical unit.
session: 2026-11-07
order: 3
tags: [astronomy, history-of-science, mathematics]
---
Kepler's clock gives the planets in units of Earth's orbit. A transit of Venus can turn that ratio into a length, if two stations far apart time the same event. What they compare is a differential parallax: Venus, being nearer, shifts on the Sun more than the Sun itself shifts. The full story of the ladder, including why 23 arcseconds is a one-radius illustration and not a ceiling, is the [Venus-to-Cepheid lesson](/topics/52-venus-transit-to-cepheid-distances/). This page is the human campaign.

![Two stations and the differential shift of Venus on the Sun](../../img/Venus_Transit_Parallax_One_Radius_Tufte.svg?v=1)
*Teaching geometry, not a 1769 tracing. Halley compared durations of the internal contacts. A single contact timed on an absolute clock needs the longitude. The black drop is mostly blur and limb darkening.*

Jeremiah Horrocks and William Crabtree, observing separately, saw the transit of 1639. Horrocks argued from Venus's small apparent disk, and from a model of sizes, that the solar parallax was not above 14 arcseconds, and the Sun at least about 15,000 Earth radii. That is not a two-station parallax. The book came out after his death, in 1662. Converted with modern constants, 14 arcseconds is about 58.4 million miles and 15,000 Earth radii about 59.4 million miles. Those mile figures are our conversion, not his words.

In 1761 Mason and Dixon were sent toward Bencoolen. Their ship, the Seahorse, was attacked in January. Mason's letter counts eleven killed and thirty-seven wounded. After repairs they observed from the Cape, and only the end of the transit, after sunrise on 6 June. Cloud early, then a clearing for the contacts. Do not promote that into a cloudless day. James Short compared the Cape with fifteen European stations. He was not their exclusive partner. His 8.47 and 8.52 arcseconds are for the day of the transit, not the mean distance. The mean-distance figure near 8.65 converts to about 94.5 million miles, roughly 1.7 percent high. A later Short value, 8.69, converts to about 94.1 million miles. Again, the miles are a modern conversion.

There was no one official answer. Pingre's 1765 reduction from Rodrigues, 10.25 arcseconds, converts to about 79.8 million miles, about 14 percent low. Hornsby, using 1769 and publishing in 1771-72, got a mean near 8.78 arcseconds, about 93.1 million miles, roughly 0.16 percent above today's 92.956 million miles. The astronomical unit is now defined as exactly 149,597,870,700 metres. Encke in 1824 combined both transits and got 8.5776 arcseconds, about 95.3 million miles, 2.5 percent high. That combination is not the 1769 result alone.

Some observers got little or nothing. Le Gentil, kept from Pondicherry by war in 1761, watched from a moving ship and the record was unusable. In 1769 a cloud hid Pondicherry again. Maskelyne at St Helena could not send a complete observation. Pingre at Rodrigues saw the Sun rise in thick cloud. At Greenwich, Bliss and Green missed the start for cloud.

In 1769 Cook and Green had a clear 3 June at Tahiti, after the quadrant was stolen on 2 May and recovered damaged but repairable. Green died of dysentery on the way home, on 29 January 1771. Chappe observed successfully at San Jose del Cabo and died on 1 August 1769 in an epidemic. The disease has been given more than one name, so this page says epidemic. Wales and Dymond wintered at Hudson Bay and did observe. Their story is not a stopped clock. Mason's share of the Cape work is the next lesson.

## Sources
- Andreas Verdun, "The Determination of the Solar Parallax from Transits of Venus in the 18th Century," Archives des Sciences 57 (2004): https://www.unige.ch/sphn/Publications/ArchivesSciences/AdS%202004-2015/AdS%202004%20Vol%2057%20Fasc%201/45-68%20Verdun.pdf
- Nicholas Kollerstrom, on Horrocks, in the IAU transit volume: https://www.dioi.org/kn/IAUVenus-Transit.pdf
- James Short, Philosophical Transactions, 1761: https://royalsocietypublishing.org/rstl/article-pdf/doi/10.1098/rstl.1761.0102/1458661/rstl.1761.0102.pdf
- ESO transit background on the expeditions: https://www.eso.org/public/outreach/eduoff/vt-2004/Background/Infol2/EIS-F3.html
- Whipple Museum, the stolen Tahiti quadrant: https://www.whipplemuseum.cam.ac.uk/explore-whipple-collections/astronomy-and-empire/stolen-quadrant

## Key facts
- Horrocks in 1639 set an upper bound near 14 arcseconds from Venus's apparent size, not from a second station. Publication was posthumous, 1662.
- Mason and Dixon reached the Cape after the Seahorse fight (11 dead, 37 wounded) and timed the end of the 6 June 1761 transit.
- Short, Hornsby, Pingre, and Encke published different parallaxes. Converted miles on this page are modern arithmetic, not their sentences.
- The modern au is exactly 149,597,870,700 metres, about 92.956 million miles. No 1761 or 1769 paper printed that definition.
''')

write("56-charles-mason.md", r'''---
title: "Charles Mason: an astronomer on difficult ground"
summary: Mason went from Bradley's assistant at Greenwich to the Cape transit of 1761 and then to the boundary survey. The place of the observer had to be known before the sky, or the line, could be trusted.
session: 2026-11-07
order: 4
tags: [history, history-of-science, astronomy, geography]
---
Charles Mason was born in Gloucestershire in 1728, a baker's or miller's son. In 1756 James Bradley brought him to Greenwich as an assistant. Not in 1750. The five years sometimes counted backward from 1761 are a way of saying he had already been there a while. The appointment year is 1756.

In September 1760 the Royal Society named him for the transit expedition toward Bencoolen, in Sumatra, with Jeremiah Dixon as his assistant. John Bird, the instrument maker, is the man usually credited with putting Dixon forward. That recommendation is the sturdy tradition. A document of their first handshake is not. This page will not invent the meeting.

The plan did not survive the voyage. After the attack on the Seahorse, told in the transit lesson, they observed from the Cape of Good Hope on 6 June 1761, and only the ending of the transit. Mason's times then entered other people's reductions. James Short compared the Cape with a set of European stations. Mason was an observer in a network, not the owner of the solar parallax.

In 1763 the same pair took the Penn-Calvert boundary. A zenith sector watches stars nearly overhead and yields a latitude. Chains and offsets turn that latitude into a mark on the ground. The legal line is geometry. It is useless if you do not know where the instrument stood. That is the transit rule brought ashore: the observer's place is part of the observation.

The survey lesson tells how the tangent was tried, found 22.51 chains off an older point, and corrected without a theatrical restart. Dixon's lesson tells the partnership from his side. Mason's job here is the simpler moral of the instruments. A number in the sky, or a post in the woods, means something only after you can say where you were standing when you took it.

## Sources
- Edwin Danson, on Mason and Dixon's astronomy, FIG 2002: https://www.fig.net/resources/proceedings/fig_proceedings/fig_2002/HS1/HS1_danson.pdf
- Todd Babcock, on the boundary survey, FIG 2002: https://www.fig.net/resources/proceedings/fig_proceedings/fig_2002/HS1/HS1_babcock.pdf
- Mason and Dixon's 1767 letter on the line, from the survey record: https://peterschmidt.domains.swarthmore.edu/engl52b/m-d.letter.html

## Key facts
- Mason was born in 1728 and became Bradley's assistant at Greenwich in 1756, not 1750.
- He led the 1761 transit party, with Dixon as assistant. Bird is generally credited with recommending Dixon. Their first meeting is not documented.
- After the Seahorse attack they timed the end of the transit from the Cape. Short and others reduced those times with European stations.
- On the boundary, latitude from a zenith sector still required a known place on the ground.
''')

write("57-jeremiah-dixon.md", r'''---
title: "Jeremiah Dixon: the surveyor in the partnership"
summary: Dixon was a Durham surveyor and amateur astronomer, recommended through John Bird's circle. On the Cape and on the boundary he was Mason's partner, not a man who only carried the chain.
session: 2026-11-07
order: 5
tags: [history, history-of-science, geography]
---
Jeremiah Dixon was born in 1733 at Cockfield, in County Durham, into a Quaker family with means. He trained as a surveyor and worked as an amateur astronomer. When the Royal Society needed a second man for the 1761 transit, John Bird's recommendation is the account to trust, and to trust only as far as it goes. Bird made instruments and knew both worlds, the workshop and the observatory. A family story about an examination at Woolwich is thinner: the Ordnance minutes that would confirm it have not been produced. Say "recommended through Bird's network," not "we watched them meet."

Dixon was not a spare hand hired to hold Mason's chain. At the Cape he observed. On the boundary, from 1763, surveying was his profession and astronomy was Mason's daily habit. The work needed both. A chain of standard length, a slope corrected, a trial line checked by a second measurement: those are the surveyor's corrections, and they are legitimate. They are not a confession that the first number was a scandal.

In October 1767 the Six Nations escort stopped at the war path. Their leader told the party that this was as far as his commission from the chiefs ran, and that he would not go one step farther west. That sentence is about a limit set by the people who sent him. It is not a license to invent a speech about fear, and it is not a permission slip written by the geometry. Some of the hired men, separately, had already refused to cross a river for fear of the Shawnee and the Delaware. Two facts. Do not melt them into one slogan.

Dixon died in Britain in 1779. The line he helped lay is the next lesson. Mason's lesson has the Greenwich years and the rule that a place must be known before a sight is interpreted. The pair only works if you can see both men.

## Sources
- Edwin Danson, FIG 2002: https://www.fig.net/resources/proceedings/fig_proceedings/fig_2002/HS1/HS1_danson.pdf
- Todd Babcock, FIG 2002: https://www.fig.net/resources/proceedings/fig_proceedings/fig_2002/HS1/HS1_babcock.pdf
- The 1767 letter, Swarthmore transcription: https://peterschmidt.domains.swarthmore.edu/engl52b/m-d.letter.html

## Key facts
- Dixon was born in 1733 at Cockfield, County Durham, and worked as a surveyor and amateur astronomer.
- Bird's recommendation brought him to Mason. The literal first meeting is unknown, and the Woolwich exam story is unverified.
- He observed at the Cape in 1761 and surveyed the boundary from 1763. Planned corrections are part of the method.
- In October 1767 the escort stopped at the commission's geographic limit. Dixon died in Britain in 1779.
''')

write("58-mason-dixon-survey.md", r'''---
title: "The Mason-Dixon survey: how a boundary became real"
summary: The famous line is a circle, a tangent, and a parallel, laid with a zenith sector and chains. A 1764 offset of 22.51 chains was corrected in place. In 1767 the Six Nations escort stopped at the limit of its commission.
session: 2026-11-07
order: 6
tags: [history, geography, mathematics]
---
The Mason-Dixon line is not one endless straight stroke. The Penn and Calvert grant needed a circle around New Castle, a tangent across the Delmarva peninsula, and then an east-west parallel. Each piece answers a clause in a charter. None of them is "draw west until the paper runs out."

Latitude came from a zenith sector, a telescope pointed near the zenith so the star's height gives the parallel. Length came from chains of a known size, with slope leveled out. On a round Earth a short piece that looks straight on the ground is not yet a parallel of latitude. You compute the parallel, then you step the offsets that keep you on it.

![The New Castle circle, a trial tangent, and the parallel](../../img/Mason_Dixon_Tangent_Offset_Method_Tufte.svg?v=1)
*A sketch of the method, drawn for this lesson. It is not a graph of leftover error along the finished line.*

In August 1764 a trial tangent about 81 miles long missed an earlier colonial tangent point by 22.51 chains, about 1,486 feet. Read that carefully. It is the offset of a planned trial from an older mark, not the collapse of a finished survey. Mason took a man and remeasured the gap himself. He came within a link, about eight inches. Through the autumn they laid proportional offsets and declared a true tangent. They did not burn the work and begin again. No document found shows one single gross mistake that forced a full restart. That sentence does not prove the party never erred. Later resurveys, in the nineteenth and twentieth centuries, are different instruments and different legal questions.

On 17 September 1767 a falling tree killed the pack-horse drivers William Baker and John Carpenter. The names come from a careful later account of the survey; they are not written in Mason's own journal, so the lesson keeps that distinction. On 9 October the leader of the escort, who had joined in July with Mohawk and Onondaga men, said the war path was as far as the chiefs of the Six Nations had commissioned him to go. He would not proceed one step farther west. Earlier, twenty-six hired men had refused a river for fear of the Shawnee and the Delaware. The journal states the commission's limit. It does not, in its own words, explain why the chiefs drew it there. Later markers that say hostile nations "ordered them to halt" are an interpretation, not the 1767 sentence.

The line later became a symbol of North and South. That symbol is a nineteenth-century use of an eighteenth-century colonial boundary. Dixon's lesson has the man who helped lay it. The geometry here is only the geometry.

## Sources
- Todd Babcock, FIG 2002: https://www.fig.net/resources/proceedings/fig_proceedings/fig_2002/HS1/HS1_babcock.pdf
- Edwin Danson, FIG 2002: https://www.fig.net/resources/proceedings/fig_proceedings/fig_2002/HS1/HS1_danson.pdf
- Mason and Dixon, 1767 letter: https://peterschmidt.domains.swarthmore.edu/engl52b/m-d.letter.html

## Key facts
- The boundary is a New Castle circle, a Delmarva tangent, and an east-west parallel, not one long line.
- The 1764 trial tangent missed an older point by 22.51 chains. Mason remeasured within a link, and offsets corrected the line. It was not a documented full restart.
- On 9 October 1767 the escort stopped at the war path, the limit of the Six Nations commission.
- Baker and Carpenter were killed by a falling tree on 17 September 1767 in later accounts of the work, not in Mason's journal itself.
''')

write("59-ships-of-exploration.md", r'''---
title: "Ships of exploration: four craft, four different jobs"
summary: Endeavour, Seahorse, Bounty, and Bounty's launch were built or bought for different work. Mixing them up mixes up Cook, Mason and Dixon, and Bligh.
session: 2026-11-07
order: 7
tags: [history, ships, geography]
---
A ship's name is a job description if you let it be. Four vessels from this day's stories are easy to tangle, and they should stay apart.

Endeavour had been the collier Earl of Pembroke. The Navy bought a cargo ship because Cook knew that kind of hull and because a survey voyage needs room for stores, not a frigate's gun deck. She carried the first voyage, 1768 to 1771: Tahiti, New Zealand, the Australian east coast. Resolution, Adventure, and Discovery came later, for the second and third voyages. They are not nicknames for Endeavour.

Seahorse, in 1761, was the naval ship that took Charles Mason and Jeremiah Dixon toward Sumatra. In January she fought a French frigate. Eleven men were killed and thirty-seven wounded, by Mason's letter. The transit party went on to the Cape. Seahorse did not draw the American boundary, and she had nothing to do with the Bounty.

Bounty had been the merchant Bethia. The Navy took her up in 1787 and rebuilt her to carry living breadfruit, a nursery where a great cabin had been. William Bligh commanded. Cook had been dead for eight years. Joseph Banks organized the plan and stayed in England. Bounty is a breadfruit ship that became a mutiny. She is not Cook's surveyor.

Her launch was a working boat about 23 feet long, carried on board like any ship's boat. After the mutiny, nineteen men were in it. At Tofua, John Norton was killed. The remaining eighteen reached Timor. The distance usually given is about 3,618 nautical miles, not statute miles. How you count the days depends on which day's entry you start from, so this page will not pretend one duration is the only honest one. A later pair, Providence and Assistant, in 1791 to 1793, did deliver breadfruit. The boat's story is the mutiny lesson. The plant's story is the breadfruit lesson. Cook's collier is the Cook lesson.

![Four vessels and the job each one actually did](../../img/Ships_Four_Jobs_Endeavour_Bounty_Seahorse_Launch_Tufte.svg?v=1)
*Roles, not a scale model. Drawn for this lesson.*

## Sources
- Royal Museums Greenwich, Cook timeline: https://www.rmg.co.uk/stories/maritime-history/captain-james-cook-timeline
- Royal Museums Greenwich, mutiny on the Bounty: https://www.rmg.co.uk/stories/maritime-history/mutiny-on-bounty
- Royal Museums Greenwich, William Bligh: https://www.rmg.co.uk/stories/maritime-history/william-bligh
- Royal Museums Greenwich, the Bounty launch model: https://www.rmg.co.uk/collections/objects/rmgc-object-68956

## Key facts
- Endeavour, ex Earl of Pembroke, was Cook's first-voyage collier. Later voyages used other ships.
- Seahorse carried Mason and Dixon in 1761 and was attacked. She is not the boundary survey and not the Bounty.
- Bounty, ex Bethia, was fitted in 1787 as a breadfruit nursery under Bligh, not under Cook or Banks.
- The launch of about 23 feet took 19 men. After Norton's death at Tofua, 18 reached Timor, some 3,618 nautical miles, not statute miles.
''')

write("60-bounty-mutiny-bligh-pitcairn.md", r'''---
title: "Bounty: mutiny, survival, and the people of Pitcairn"
summary: Christian took the Bounty on 28 April 1789. Bligh's launch reached Timor after Norton was killed at Tofua. On Pitcairn the Polynesian women and children, not Adams alone, made the community that lasted.
session: 2026-11-07
order: 8
tags: [history, ships, geography]
---
On 28 April 1789 Fletcher Christian took HMS Bounty from William Bligh. Bligh and eighteen others were put in the launch. Not everyone left aboard had chosen the mutiny in the same way, and not every man in the boat was a loyal volunteer in a simple story. The ship's jobs, nursery and boat, are the ships lesson. This page is what people did.

Bligh could navigate. He was also harsh to his company. A court later acquitted him of losing the ship. An acquittal says the Navy did not convict him. It does not wash the temper out of the record.

At Tofua on 2 May his own narrative is the one we have. He had told his men to agree on a cover: the ship had sunk on 1 May. Islanders tried to haul the boat ashore, and Bligh brandished a cutlass. When he refused to stay the night, a chief threatened them. John Norton ran up the beach to cast off the stern line, though he was called back. As the crew boarded, the attack began. Norton was struck down. Bligh cut the rope with a pocket knife. Bligh inferred that the visitors meant to take the boat and the stores, and that they had learned the party had no firearms. That is his inference. There is no account here from Tofua, and there is no proven single provocation that rests on Norton alone.

They reached Timor. Not every man of the launch lived to see England again.

In January 1790 nine British mutineers, six Polynesian men, twelve women, and an infant came to Pitcairn. Infant counts vary, and this page will not pretend they do not. People had lived on the island before. It was empty then. The Bounty was burned on 23 January. The Pitcairn government describes the Polynesian men as treated more like slaves than like partners. Land, weapons, and the women's choices were not shared. In September 1793 five of the mutineers were killed: Christian, Mills, Martin, Williams, and Brown. By 1794 all six Polynesian men were dead. Later tellings disagree about who struck whom. McCoy killed himself in 1798. Young and Adams killed Quintal in 1799. Young died in 1800. Adams lived until 1829, the last of the mutineers, not the author of a peaceful idyll. The women and the children are the center of what continued.

The American ship Topaz, under Mayhew Folger, found the settlement in 1808. In 1831 a removal to Tahiti brought disease and deaths, then a return. In 1856 the community went to Norfolk Island. Some families came back to Pitcairn later. Head counts differ by source, so this lesson will not pick a false exact number. Descendants live on both islands. The breadfruit those ships were built to move is the next lesson in the chain.

## Sources
- Royal Museums Greenwich, the mutiny and Bligh: https://www.rmg.co.uk/stories/maritime-history/mutiny-on-bounty and https://www.rmg.co.uk/stories/maritime-history/william-bligh
- William Bligh, A Voyage to the South Sea (Project Gutenberg): https://www.gutenberg.org/cache/epub/15411/pg15411.txt
- Government of Pitcairn, history: https://www.government.pn/history
- Maike Gauger and others, on Pitcairn's early years, ANU Press: https://press-files.anu.edu.au/downloads/press/n2159/pdf/ch06.pdf

## Key facts
- The mutiny was 28 April 1789. Bligh and 18 others took the launch. Not everyone remaining aboard was a willing mutineer in the same sense.
- At Tofua on 2 May, Norton was killed while casting off the stern line. Bligh's book is the account we have. It infers motive. It is not a Tongan testimony.
- Pitcairn, January 1790: nine British mutineers, six Polynesian men, twelve women, and an infant. The ship was burned on 23 January.
- By 1794 the Polynesian men were dead and five mutineers had been killed. Adams was the last surviving mutineer, not the whole community.
''')

write("61-breadfruit-and-empire.md", r'''---
title: "Breadfruit and empire: moving a living crop"
summary: Breadfruit was a Pacific staple long before Banks. The Bounty was meant to carry living plants to feed enslaved Caribbean workers. Providence and Assistant finished that delivery in 1793.
session: 2026-11-07
order: 9
tags: [history, history-of-science, geography]
---
Breadfruit, Artocarpus altilis, is a starchy staple of the Pacific. People there cultivated it long before a British ship asked for cuttings. Many of the kinds grown for food are seedless. You do not ship them as a bag of seed. You ship a living plant: stem, root, and the water and shade those roots need. That is why a warship's cabin was rebuilt as a nursery. The botany is real. It is also the reason the voyage was so easy to ruin.

Joseph Banks organized the plan. He did not captain it. The stated use was cheap food for enslaved workers on Caribbean plantations, not a clean gift from one people to another. Scientific care and an oppressive purpose traveled in the same pots. The Banks lesson has the organizer. The Bounty lesson has the mutiny that threw the first cargo away in 1789.

A second try worked. HMS Providence and Assistant, under Bligh again, sailed in 1791 and in 1793 landed breadfruit at St Vincent and Jamaica, first into botanical gardens and then out toward plantations. The trees that grow in the Caribbean now are part of the food of those islands. Genetic studies tie modern cultivars back to Pacific stock moved in that era. A plant can become ordinary in a kitchen and still have a harsh reason for the crossing.

Nothing in that success rewrites the first plan. Ingenuity in keeping a tree alive at sea is not the same thing as a kind motive. If you want the ship that failed, read the mutiny. If you want the man who ordered the trees, read Banks. This page is only the crop, and the fact that it was sent as provisions for people who were not free.

## Sources
- Natural History Museum, on Banks: https://www.nhm.ac.uk/discover/joseph-banks-scientist-explorer-botanist.html
- Current Biology (2023), on the genetic history of breadfruit introductions: https://www.cell.com/current-biology/fulltext/S0960-9822(22)01901-7
- Royal Museums Greenwich, William Bligh: https://www.rmg.co.uk/stories/maritime-history/william-bligh
- Tropical Agriculture, on breadfruit in the Caribbean: https://journals.sta.uwi.edu/ojs/index.php/ta/article/view/6507

## Key facts
- Artocarpus altilis was cultivated in the Pacific long before European voyages. Seedless kinds travel as living plants, not as seed.
- Banks's plan for the Bounty was cheap food for enslaved Caribbean workers, not a purely humanitarian gift.
- The Bounty never delivered. Providence and Assistant brought plants to St Vincent and Jamaica in 1793.
- Modern Caribbean trees are tied by genetics and by history to that transfer. The meal does not erase the purpose.
''')

write("62-aristarchus-of-samos.md", r'''---
title: "Aristarchus: a moving Earth and a measurable Moon"
summary: Archimedes says Aristarchus put the Earth in orbit. The surviving book is a different job: a quarter-moon triangle and a lunar eclipse, neither of which prints the modern distance to the Moon.
session: 2026-11-07
order: 10
tags: [astronomy, history-of-science, mathematics]
---
Aristarchus of Samos, about 310 to 230 BCE, is the first Greek we can name who set the Earth moving around the Sun, and turning once a day, with the stars so distant that the year shows no shift. We know that proposal because Archimedes reports it. The book itself is lost. The book we still have, On the Sizes and Distances of the Sun and Moon, does geometry. It is not the heliocentric treatise, and it should not be asked to prove one.

Three claims get fused in retellings. They are different.

First, the heliocentric idea, attested, not surviving in his own diagrams.

Second, the quarter Moon. At half phase, the angle at the Moon, between Sun, Moon, and Earth, is a right angle. Measure how far the Moon stands from the Sun in the sky, and the triangle gives the Sun's distance in units of the Moon's. Aristarchus took that elongation as 87 degrees and found a Sun about 18 to 20 times farther than the Moon. The real ratio is about 400. Half-moon is so close to 90 degrees from the Sun that a small mistake in "exactly half" wrecks the answer. The diagram draws 87 degrees so you can see the right angle. The sky is less obliging.

Third, a lunar eclipse. The Moon crosses Earth's shadow. That shadow is a cone that tapers, because the Sun is a wide disk, not a point of light. You need the Moon's angular size and the Sun's geometry. The width of the dark patch, alone, is not a distance.

![The quarter-moon triangle and a tapering eclipse shadow](../../img/Aristarchus_Quarter_Moon_and_Eclipse_Shadow_Tufte.svg?v=1)
*Two drawings, two questions. Neither is to scale. The left-hand elongation is the assumed 87 degrees, not the true angle.*

Do not hand Aristarchus the modern "about 60 Earth radii" as if his book printed it and got it right. Reconstructions of the angles he adopted are shaky. What is solid is the distinction he forces on us: a physical width, an angle, and a distance are three different things, and a triangle can connect them. No calculus is required. Hipparchus, next, uses a baseline on the Earth and other people's eclipse reports. A thumb at arm's length, much later in this day's lessons, is the same triangle with worse numbers and an assumed distance.

## Sources
- MacTutor, biography of Aristarchus: https://mathshistory.st-andrews.ac.uk/Biographies/Aristarchus/
- MacTutor, on the sizes and distances: https://mathshistory.st-andrews.ac.uk/BEA/aristachus_bea.pdf

## Key facts
- The heliocentric proposal is known from Archimedes. It is not the surviving Sizes and Distances.
- The quarter-moon triangle, with an assumed 87-degree elongation, gave a Sun only about 18 to 20 times farther than the Moon. The real ratio is about 400.
- A lunar eclipse needs the taper of Earth's shadow and the Moon's angular size. Shadow width alone is not the distance.
- The modern Moon, near 60 Earth radii, is not a figure to attribute to Aristarchus as a successful original result.
''')

write("63-hipparchus-lunar-parallax.md", r'''---
title: "Hipparchus: the Moon changes place when we move"
summary: Hipparchus used eclipse reports from two latitudes, not a double journey of his own. The Moon's parallax against a shared solar direction gave a distance with wide edges, near the modern value and not a lucky single number.
session: 2026-11-07
order: 11
tags: [astronomy, history-of-science, mathematics]
---
Hold a finger at arm's length and look with one eye, then the other. The finger jumps against the far wall. The gap between your eyes is the baseline. The angle of the jump, with that baseline, is a distance. That is parallax. Hipparchus, in the second century BCE, used it on the Moon. Most of his books are lost. Later astronomers rebuilt the argument from what they still had.

One famous piece uses a solar eclipse. It was total at the Hellespont. At Alexandria, about four-fifths of the Sun's diameter was still in view. That is a fraction of the diameter, not four-fifths of the disk's area. A date often proposed is 14 March 190 BCE. The identification is not secure, and this lesson will not pretend it is. Hipparchus used reports. He did not stand in both cities.

![Two stations, one Moon, a shared solar direction](../../img/Hipparchus_Lunar_Parallax_Two_Stations_Tufte.svg?v=1)
*The angle is drawn far too large. The Sun's own parallax is treated as negligible beside the Moon's. Drawn for this lesson.*

The baseline is the north-south distance on the Earth between those latitudes. The sightlines to the Moon differ. The Sun is so far that its direction can be treated as the shared wall. G. J. Toomer's reading of the reconstruction gives one lower bound near 71 Earth radii. Other ways of treating the shadow and the Sun's distance give a band roughly 59 to 67 Earth radii. That band is not a modern confidence interval. The Moon really averages near 60 Earth radii, and the distance changes a little through the month. An ancient model can land close to the truth and still be a model with wide edges. Nearness is not the same thing as a tight measurement.

Compare the sticks. The Venus stations of 1761 and 1769 stand on the Earth's surface, a baseline of hundreds or thousands of miles. Kepler's Mars triangles, later in this day's lessons, use a baseline the size of Earth's orbit. Hipparchus is the same idea with the cities of two reports. Aristarchus, just before this page, was comparing sizes inside one triangle. Here the observer moves, and the Moon moves on the sky.

## Sources
- MacTutor, biography of Hipparchus: https://mathshistory.st-andrews.ac.uk/Biographies/Hipparchus/
- MacTutor, Dictionary of Scientific Biography excerpt: https://mathshistory.st-andrews.ac.uk/DSB/Hipparchus.pdf

## Key facts
- Parallax is a known baseline and an angle. Hipparchus's own books are mostly lost and were rebuilt by later writers.
- The eclipse was total at the Hellespont and showed about four-fifths of the Sun's diameter at Alexandria. He used reports. He was not at both stations. The 190 BCE date is uncertain.
- Reconstructions give a lower bound near 71 Earth radii in one reading, and roughly 59 to 67 in others. That is not one confidence interval.
- The modern mean is near 60 Earth radii and varies. Venus transits use a surface baseline. Kepler's Mars work uses the orbit.
''')

write("64-galileo-jupiters-moons.md", r'''---
title: "Galileo's moons: new centers and lasting names"
summary: In January 1610 Galileo found four bodies circling Jupiter and called them the Medicean Stars. The names Io, Europa, Ganymede, and Callisto come from Marius in 1614, with a calendar trap in the priority story.
session: 2026-11-07
order: 12
tags: [astronomy, history-of-science, history]
---
On 7 January 1610 Galileo saw points of light beside Jupiter, lined up east and west and changing place from night to night. He came to understand four bodies going around Jupiter. Sidereus Nuncius, in March 1610, told Europe. The fuller story of his telescope and his trial is the [Galileo](/topics/46-galileo/) page. This page is only the moons, and the names.

They matter because not every moving body has to orbit the Earth. One old objection to Copernicus was that a traveling Earth would leave its Moon behind. Jupiter travels, in any of the systems then argued, and it keeps four companions. That weakens the objection. It does not finish the case. Tycho Brahe's system, Sun around the Earth and the other planets around the Sun, can hold moons around Jupiter just as well. New centers of motion are real. They are not, by themselves, a proof of a moving Earth.

Galileo named the four, together, the Medicean Stars, for the Medici who paid the patronage. He did not give them the names on a modern chart. Those names, Io, Europa, Ganymede, and Callisto, in that order outward, are Simon Marius's, in Mundus Iovialis of 1614. Marius said Kepler suggested them.

![The four moons in outward order, not to scale](../../img/Galileo_Four_Moons_Order_Tufte.svg?v=1)
*A reading order, drawn for this lesson. The gaps are equal so the names can be read. The orbits are not equally spaced, and the dots are not the moons' sizes.*

Marius also said he first saw the moons on 29 December 1609. That date is Julian. On the Gregorian calendar it is 8 January 1610, the day after Galileo's 7 January. Do not treat the two calendars as if they were the same day, and do not call Marius a fraud because the numbers sit close. Who published a dated book first is one question. Who looked, independently, is another. The quarrel is real. A collapsed calendar is not evidence.

Io, the inner one, later became a clock. When it enters Jupiter's shadow the reflected sunlight stops, and the timetable of those eclipses taught Rømer that light takes time. That is the next lesson.

## Sources
- Museo Galileo, on Jupiter's moons: https://catalogue.museogalileo.it/indepth/JupitersMoonsSatellites.html
- Museo Galileo, Sidereus Nuncius (1610): https://www2.museogalileo.it/it/biblioteca-e-istituto-di-ricerca/progetti/incontra-galileo/31-opere/454-sidereus-nuncius-1610.html
- Pasachoff, "Simon Marius's Mundus Iovialis and the discovery of the moons of Jupiter," IAU proceedings, 2018: https://ui.adsabs.harvard.edu/abs/2018iau3.book...38P/abstract

## Key facts
- Galileo recorded moons of Jupiter from 7 January 1610 and published them in March 1610 as the Medicean Stars.
- Moons around Jupiter answer one objection to a moving Earth. Tycho's system can include them too. They are not a complete proof of Copernicus.
- Io, Europa, Ganymede, and Callisto are Marius's 1614 names, which he credited to a suggestion from Kepler.
- Marius's 29 December 1609 is Julian. Gregorian, it is 8 January 1610. Do not equate the calendars or assume fraud from the numbers.
''')

write("65-romer-io-speed-of-light.md", r'''---
title: "Romer and Io: light needs time"
summary: In 1676 Romer argued that Io's eclipses run late or early because light takes time to cross a changing distance. He did not publish 230,000 kilometers a second. Huygens made a speed later, from an orbital scale.
session: 2026-11-07
order: 13
tags: [astronomy, history-of-science, mathematics]
---
Io goes around Jupiter in about 42.5 hours. We see it by sunlight reflected from its surface. When Io enters Jupiter's shadow, that sunlight is cut off. The moon has not switched off a lamp of its own. The disappearances and returns are eclipses, and they can be timed. The names and the order of the four moons are the previous lesson.

Giovanni Cassini had been building tables of those times. Ole Romer, working with that program in Paris, argued in 1676 that the tables made sense if light travels at a finite speed. Earth moves around the Sun once a year. When Earth is traveling away from Jupiter, each eclipse is seen a little later, because the light has a longer trip. When Earth is traveling toward Jupiter, the events come early. The extra minutes are the light-time of the extra distance.

Jupiter moves too, and Io's orbit is not a perfect clock. Many nights are required before the leftover can be blamed on light rather than on the tables. The traditional round number is about 22 minutes for light to cross the diameter of Earth's orbit. The modern light-time for that same diameter is about 16 minutes 40 seconds.

![Io's shadow eclipse, and Earth near and far from Jupiter](../../img/Romer_Io_Light_Time_Schematic_Tufte.svg?v=1)
*A schematic, drawn for this lesson. Jupiter is much farther, and it moves. The inset is the local event: reflected light cut off by the shadow.*

Romer did not publish a speed of 230,000 kilometers a second. Christiaan Huygens, in the Treatise on Light of 1690, converted an orbital scale into a speed that comes out near that figure in modern units. The defined speed of light is now 299,792.458 kilometers a second. A conversion is not a sentence Romer printed.

You also cannot pick one opposition and one conjunction and call them a clean pair. Near conjunction, Jupiter sits in the Sun's glare and Io's eclipses cannot be watched. The argument is a stack of dates. The drawing shows the idea, not the observing calendar.

## Sources
- Paris Observatory, "340 years ago, Romer showed that light has a finite speed": https://observatoiredeparis.psl.eu/340-years-ago-romer-showed.html
- Observatoire de Paris, CLEA / CLIC notes on Romer: https://clic.obspm.fr/

## Key facts
- Io's eclipses are the cutting off of reflected sunlight in Jupiter's shadow, on a clock of about 42.5 hours. Io does not emit the light.
- Romer in 1676 explained early and late eclipses by a finite speed of light as Earth moved nearer or farther.
- The traditional 22 minutes across Earth's orbit compares with a modern 16 minutes 40 seconds. Jupiter's motion and Io's orbit also affect the times.
- Huygens, not Romer, produced the speed later quoted near 230,000 km/s. The defined value is 299,792.458 km/s.
''')

write("66-kepler-mars-triangulation-and-scale.md", r'''---
title: "Kepler's Mars triangles, and an honest scale check"
summary: Kepler placed Mars by crossing lines of sight from a moving Earth, many times, until the path was an ellipse. An early teaching drawing of that ellipse was exaggerated on purpose. This page shows the real shape beside it.
session: 2026-11-07
order: 14
tags: [astronomy, history-of-science, mathematics]
---
Kepler did not guess Mars's orbit from one night. Mars returns to the same place in its path about every 687 days. Earth has moved. If you know where Earth is, two lines of sight to that same Martian place cross, and you have a point in space. Angles measured against the stars give the directions. One angle plus a guessed radius is not enough. Kepler also had to repair Earth's own orbit before the crossings would sit still. Many pairs, not one clever triangle, drew the curve. It is an ellipse, with the Sun at a focus.

Opposition and conjunction are easy to mix up with a measurement. At opposition the order is Sun, Earth, Mars, with Earth in the middle. Mars is up all night and near its brightest. At conjunction the order is Earth, Sun, Mars. Mars is lost in the glare. Nothing is eclipsed. A straight alignment is not, by itself, a distance. Hipparchus's lesson uses a short baseline on the Earth. Here the baseline is Earth's whole orbit, the same stick that, once it has a length in miles, carries the [transit lesson](/topics/52-venus-transit-to-cepheid-distances/) outward.

An early illustrated sheet of this ellipse, made to be obvious in a small picture, stretched the truth and said so in a caption. It was not a printer's accident. On that sheet Mars's semiaxes were 247 and 199 drawing units, and Earth's orbital radius was 66. The ratio is about 3.74, against the real ratio of semimajor axes, about 1.524. The drawing is about 2.46 times too stretched. Its eccentricity is about 0.59, against Mars's real 0.093, roughly six times too oval. The Sun sits about 2.2 of those Earth-radii from the center. In the sky the offset is about 0.14 AU. If you treat the drawn Earth radius as 1 AU, the sheet's nearest and farthest distances are about 1.53 and 5.96 AU. The real ones are about 1.38 and 1.67 AU.

Earth's orbital radius ought to be about 66 percent of Mars's semimajor axis, not about 27 percent. That is why Earth looks tiny on the old panel. The tininess is the exaggeration. It is the wrong reason for the eye to think Earth is small. The planet dots on that sheet were 14 and 12 units across, a ratio near 1.17. Mars's diameter is about 6,792 kilometers and Earth's about 12,756, a ratio near 0.53. Dots are names, not worlds.

![Real Mars beside the exaggerated teaching ellipse](../../img/Kepler_Mars_Real_vs_Exaggerated_Ellipse_Tufte.svg?v=1)
*Both panels use the same Mars semimajor axis, and both put the Sun at the focus. The right-hand ellipse is the exaggerated lesson, labeled as such. The dots are not the planets' physical sizes.*

## Sources
- Steven Austin, notes on Kepler's Mars orbit: https://faculty.uca.edu/saustin/3110/mars.pdf
- Physics Today, on Kepler and Mars: https://physicstoday.aip.org/features/the-great-martian-catastrophe-and-how-kepler-fixed-it
- NASA Mars fact sheet: https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html
- NASA, Mars at opposition: https://science.nasa.gov/asset/hubble/close-encounter-mars-at-opposition/
- NASA, geometry of a Mars conjunction: https://science.nasa.gov/resource/geometry-of-mars-solar-conjunction/

## Key facts
- A repeated heliocentric place of Mars, seen from two known positions of Earth, fixes a point. Many points make the ellipse. One angle is not enough.
- Opposition puts Earth between the Sun and Mars. Conjunction hides Mars in the Sun's glare. Neither alignment is a distance by itself.
- The exaggerated sheet has orbital ratio about 3.74 instead of 1.52, and eccentricity about 0.59 instead of 0.093. Earth's orbit should be about 66 percent of Mars's semimajor axis, not 27 percent.
- Marker dots are not physical sizes. Mars is about half of Earth's diameter, not slightly larger.
''')

write("67-jos-a-bank-american-clothier.md", r'''---
title: "Jos. A. Bank: an American clothier, not Joseph Banks"
summary: The Baltimore menswear firm is a twentieth-century family business, later sold to Quaker Oats, then to Men's Wearhouse in 2014. It is not the British botanist, and it was not bought by Brooks Brothers.
session: 2026-11-07
order: 15
tags: [history]
---
The name looks like the botanist and is not him. Jos. is an abbreviation of Joseph. Bank, on the shop signs, has no final s. Sir Joseph Banks sailed with Cook and is the subject of another lesson on this day. This page is a clothing company in Baltimore.

The usual founding date is 1905, with a family workshop behind it. Charles Bank, a Lithuanian immigrant, was a tailor. His grandson Joseph worked young, as a cloth cutter and a salesman. A family trade, a formal company, and a brand name are three dates. Do not collapse them into one man who did everything in one year. Sources even disagree about the grandson's middle name, so this lesson uses Joseph and does not pretend to settle it.

Joseph married Anna Hartz, of a Baltimore clothing family. The partnership called L. Hartz & Bank belongs to those early years. Published accounts put it in 1912 or in 1922. Both years are in print, so this page will not pick one it cannot defend. In 1945 Joseph and his son Howard bought the Hartz share. The brand Jos. A. Bank is the name from that change of ownership.

Shops of their own came in the 1950s, a catalog around 1960. There were 11 stores when Quaker Oats bought the firm in 1981. A leveraged buyout in 1986 left a heavy debt and a near failure, then a recovery and a public sale of shares in 1994.

On 18 June 2014 Men's Wearhouse completed the purchase at 65 dollars a share, about 1.8 billion dollars, after the two companies had tried to buy each other in 2013. It was not a sale to Brooks Brothers in 2011. The parent company took the name Tailored Brands in 2016. In 2020 that parent went through Chapter 11 and emerged as a private company on 1 December. The brand still sells clothes. A current store count is easy to invent and is left out.

No British chain named for the botanist turned up in the records checked for this lesson. Not finding a chain is not a proof that none ever existed. It is a reason not to tell that story. The Chicago firm Hart Schaffner & Marx, next, is another similar name with no documented tie to these Hartzes.

## Sources
- Encyclopedia.com, Jos. A. Bank Clothiers: https://www.encyclopedia.com/books/politics-and-business-magazines/jos-bank-clothiers-inc
- Tailored Brands, 18 June 2014, on the Men's Wearhouse acquisition: https://www.tailoredbrands.com/2014/06/18/mens-wearhouse-completes-acquisition-of-jos-a-bank/
- Tailored Brands, 1 December 2020, on emerging from restructuring: https://www.tailoredbrands.com/2020/12/01/tailored-brands-successfully-completes-financial-restructuring/

## Key facts
- Jos. A. Bank is a Baltimore clothier. Joseph Banks the botanist is a different person. The spellings differ.
- The firm is dated from 1905, with earlier family work. Charles Bank was the immigrant tailor. Joseph, his grandson, was the young cutter. Do not force one sole founder.
- In 1945 Joseph and Howard bought the Hartz interest. The 1912 and 1922 partnership dates conflict, so neither is asserted here.
- Men's Wearhouse bought the company on 18 June 2014 for about 1.8 billion dollars. Not Brooks Brothers in 2011. Tailored Brands emerged from Chapter 11 on 1 December 2020.
''')

write("68-hartz-versus-hart-schaffner-marx.md", r'''---
title: "Hartz and Hart Schaffner and Marx: names are not a pedigree"
summary: Baltimore's Hartz family, tied to Jos. A. Bank, is not the Chicago firm Hart Schaffner and Marx. No document found links them. Absence of a document does not prove the families were unrelated in Europe.
session: 2026-11-07
order: 16
tags: [history]
---
Lena Hartz and her daughter Anna belong to a Baltimore clothing family. Anna married Joseph Bank, and that story is the clothier lesson. Harry Hart and Max Hart belong to Chicago. The trade is the same. The name is similar. A pedigree is something else.

In Chicago the roots are a Hart brothers' shop in 1872. In 1879 Levi Abt and Marcus Marx joined them. Joseph Schaffner joined in 1887, and the familiar name Hart Schaffner & Marx is that company. Do not say the firm was formed after 1945. That year is the Baltimore buyout, in another city, of a Hartz share in a different business.

A careful history of Schaffner's migration, from the German Historical Institute's work, shows a network of people from near Worms. It shows how a young man entered a Chicago house. It does not show a contract with Baltimore. Some accounts say Abt and Marx left when Schaffner arrived. Others say Marx stayed. Those details conflict, they are not needed for this question, and they are not a bridge to the Hartzes. They are left out on purpose.

No partnership paper, no share ledger, and no family record found for this lesson ties the Baltimore Hartz firm to the Chicago company. Read that as a limit, not as a triumph. Not finding a document does not prove the families were strangers back in Europe. It does forbid the sentence "they were one house."

What would count? For a business, a partnership agreement, articles of incorporation, or a record of ownership. For kinship, a birth, a marriage, a ship's list, a census, or a will that names people on both sides. A German-sounding surname in the garment trade is the start of a search. It is not the result.

If a "Hart" in Chicago is needed for context, there is already another one. Cousins Abraham and Henry Hart had a different firm, also spoken of as Hart brothers, and it was not this company. Similar names inside one city are a warning, not a family tree. The Bank lesson has the Baltimore side. This page only refuses the false pedigree.

## Sources
- Encyclopedia of Chicago, Hart, Schaffner & Marx: https://encyclopedia.chicagohistory.org/pages/2695.html
- Immigrant Entrepreneurship, "Joseph Schaffner": https://www.immigrantentrepreneurship.org/entries/joseph-schaffner/
- Encyclopedia.com, Hartmarx: https://www.encyclopedia.com/social-sciences-and-law/economics-business-and-labor/businesses-and-occupations/hartmarx-corp

## Key facts
- Baltimore's Hartz family is part of the Jos. A. Bank story. Chicago's Harry and Max Hart are part of Hart Schaffner & Marx. They are not the same firm.
- The Chicago company grows from 1872, with Marx and Abt in 1879 and Schaffner in 1887. It was not formed after 1945.
- No business record or kinship record found here links the two. That does not prove there was never a remote family tie.
- A real link would be a partnership, an ownership record, or a civil document naming both sides. The same trade and a similar name are not that link.
''')

# Topic 69: attached prose, verbatim paragraphs, site formatting only.
raw = PROSE.read_text(encoding="utf-8")
lines = [ln.rstrip() for ln in raw.splitlines()]
# Drop a trailing tool-marker line if one is present.
while lines and (not lines[-1].strip() or lines[-1].strip().lower().startswith("tool") or "toolmarker" in lines[-1].lower() or lines[-1].strip().startswith("<")):
    lines.pop()
body_lines = []
# Skip the PDF title block (first three non-empty lines through the date line) and PAGE banners.
skip_prefixes = ("THUMB TO MOON", "Calculating the Moon", "An Abbé Faria", "An Abbe Faria", "PAGE ")
for ln in lines:
    s = ln.strip()
    if any(s.startswith(p) for p in skip_prefixes):
        continue
    body_lines.append(ln)
text = "\n".join(body_lines).strip()
# Turn the prose's section titles into markdown headings. They are the short lines followed by a paragraph.
sections = [
    "A little window on a large Moon",
    "A correction worth keeping",
    "The rule behind the picture",
    "From your arm to the Moon",
    "An easier route: go around a circle",
    "Does the answer make sense?",
    "SOURCE",
]
for sec in sections:
    text = text.replace(sec, "## " + sec, 1)
# Link the separate lesson mention without changing the words around it.
text = text.replace(
    "that is a separate lesson.",
    "that is a [separate lesson](/topics/62-aristarchus-of-samos/).",
)
# Insert the diagram before the circle section.
diagram = """![A measuring circle: half a degree is one part in 720 of the circumference](../../img/Thumb_to_Moon_Circumference_Not_Radius_Tufte.svg?v=1)
*Teaching circle centered on the eye, not the Moon's orbit. Drawn for this page from the lesson's own arithmetic. The distance is assumed.*

"""
text = text.replace("## An easier route: go around a circle", diagram + "## An easier route: go around a circle", 1)
download = """

The printed lesson, reviewed and kept byte for byte, is [Thumb to Moon (PDF)](/downloads/Thumb_to_Moon_Calculating_the_Moons_Diameter_Faria_Lesson_2026-11-07.pdf).

## Key facts
- A thumb about 2 cm wide at 60 cm covers about 2 degrees. A 2-inch thumb at 24 inches covers about 4.77 degrees. The units are not interchangeable.
- Half a degree at an assumed 240,000 miles is about 2,100 miles if you divide the circumference by 720. Dividing the distance alone by 720 gives about 333 miles and drops the factor of about 6.28.
- The Moon's mean diameter is about 2,160 miles. The thumb does not measure the distance. It uses a distance you already assumed.
- NASA's figures: mean distance 238,855 miles, radius about 1,080 miles. https://science.nasa.gov/moon/facts/
"""
text = text.rstrip() + "\n" + download
front = '''---
title: "Thumb to Moon: calculating the Moon's diameter"
summary: A thumb can hide the Moon because apparent size depends on distance. Half a degree at an assumed 240,000 miles is about 2,100 miles if you divide the whole circle by 720, close to the Moon's real 2,160-mile diameter.
session: 2026-11-07
order: 17
tags: [astronomy, mathematics]
---
'''
write("69-thumb-to-moon-calculating-the-moons-diameter.md", front + "\n" + text)
print("all topics emitted")




