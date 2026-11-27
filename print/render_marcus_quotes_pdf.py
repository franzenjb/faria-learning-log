#!/usr/bin/env python3
"""Cream/serif/rust desk sheet for the Marcus Aurelius quote-check lesson.

Header and footer carry faria.jbf.com and jbf@jbf.com. Links appear only at the end.
"""
import base64
import html
import sys
from pathlib import Path

sys.path.insert(0, "/workspace/franzen_pdf_env/lib/python3.13/site-packages")
from weasyprint import HTML

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "downloads" / "Marcus_Aurelius_Quotes_Checked_Against_Meditations_Faria_2026-11-27.pdf"
IMG = ROOT / "public" / "img" / "Equestrian_Statue_Marcus_Aurelius_Capitoline_Replica_Head_Jebulon.jpg"

CSS = """
@page {
  size: letter;
  margin: 0.55in 0.62in 0.52in 0.62in;
  background: #fbf8f2;
  @top-left {
    content: "Faria  ·  faria.jbf.com";
    font-family: "Liberation Serif", Georgia, serif;
    font-size: 9pt;
    color: #7a4b1e;
  }
  @top-right {
    content: "jbf@jbf.com";
    font-family: "Liberation Serif", Georgia, serif;
    font-size: 9pt;
    color: #7a4b1e;
  }
  @bottom-left {
    content: "A lesson from faria.jbf.com";
    font-family: "Liberation Serif", Georgia, serif;
    font-size: 8.5pt;
    color: #6b645a;
  }
  @bottom-right {
    content: counter(page) " / " counter(pages);
    font-family: "Liberation Serif", Georgia, serif;
    font-size: 8.5pt;
    color: #6b645a;
  }
}
html, body { background: #fbf8f2; }
body {
  font-family: "Liberation Serif", Georgia, serif;
  font-size: 10.4pt;
  line-height: 1.32;
  color: #22201c;
}
h1 {
  font-weight: normal;
  font-size: 19.5pt;
  line-height: 1.15;
  color: #7a4b1e;
  margin: 0 0 0.06in;
}
h2 {
  font-weight: normal;
  font-size: 13.4pt;
  line-height: 1.2;
  color: #7a4b1e;
  margin: 0.13in 0 0.04in;
  break-after: avoid;
}
p { margin: 0 0 0.055in; }
.kicker {
  font-size: 9.6pt;
  color: #6b645a;
  margin: 0 0 0.07in;
}
.lede { font-size: 10.8pt; color: #3a352e; }
.hero {
  float: right;
  width: 1.95in;
  margin: 0 0 0.08in 0.14in;
}
.hero img { width: 100%; height: auto; display: block; }
.hero p.cap {
  font-size: 7.8pt;
  line-height: 1.25;
  color: #6b645a;
  margin: 0.04in 0 0;
}
.callout {
  border-left: 3px solid #7a4b1e;
  padding: 0.06in 0 0.06in 0.12in;
  margin: 0.08in 0 0.10in;
  background: #f3eee4;
  break-inside: avoid;
}
.callout p { margin: 0; }
.q {
  margin: 0 0 0.10in;
  break-inside: avoid;
}
.q .poster {
  font-style: italic;
  color: #22201c;
  margin: 0 0 0.02in;
}
.q .verdict {
  color: #7a4b1e;
  margin: 0 0 0.02in;
}
.q .trans { margin: 0 0 0.02in; }
.q .plain { margin: 0; }
.sources { clear: both; break-inside: avoid; }
.sources a { color: #7a4b1e; text-decoration: none; }
.sources p, .sources li { font-size: 9.6pt; line-height: 1.3; }
ul { margin: 0.03in 0 0.08in; padding-left: 0.18in; }
li { margin: 0.02in 0; }
p, li { orphans: 3; widows: 3; }
h2, .q .poster, .q .verdict { break-after: avoid; }
"""


def esc(s):
    return html.escape(s, quote=True)


def q(poster, verdict, trans, meaning):
    return (
        f'<div class="q">'
        f'<p class="poster">“{esc(poster)}”</p>'
        f'<p class="verdict"><b>Verdict:</b> {verdict}</p>'
        f'<p class="trans">{trans}</p>'
        f'<p class="plain"><b>Plain meaning:</b> {esc(meaning)}</p>'
        f'</div>'
    )


def main():
    raw = IMG.read_bytes()
    b64 = base64.b64encode(raw).decode("ascii")
    img_src = f"data:image/jpeg;base64,{b64}"

    # trans fields may contain light markup already escaped below via construction
    items = []

    items.append(q(
        "You have power over your mind—not outside events. Realize this, and you will find strength.",
        "Genuine idea, modern wording. Closest: 7.2; also 4.3. (6.8 is only loosely related; 8.47 is a cousin.)",
        "<b>Long, 7.2:</b> “I can have that opinion about anything which I ought to have. If I can, why am I disturbed? The things which are external to my mind have no relation at all to my mind.—Let this be the state of thy affects, and thou standest erect.”",
        "Events are not yours to command. The judgment you form of them is.",
    ))
    items.append(q(
        "The happiness of your life depends upon the quality of your thoughts.",
        "Genuine idea, modern wording of 5.16. The old translations speak of the character of the mind, not “happiness.”",
        "<b>Long, 5.16:</b> “Such as are thy habitual thoughts, such also will be the character of thy mind; for the soul is dyed by the thoughts.”",
        "What you keep thinking about stains the mind. Choose the dye.",
    ))
    items.append(q(
        "Everything we hear is an opinion, not a fact. Everything we see is a perspective, not the truth.",
        "Spurious as a quotation. It loosely grows from 2.15 and 12.22 (and 4.3, “life is opinion”), but the viral wording adds “not a fact” and “not the truth,” which Marcus did not write. He was a Stoic, not a skeptic.",
        "<b>Long, 2.15:</b> “Remember that all is opinion.” Casaubon, same Monimus passage: “Remember that all is but opinion and conceit.” <b>Long, 12.22:</b> “Consider that everything is opinion, and opinion is in thy power. Take away then, when thou choosest, thy opinion…”",
        "The sting is in your judgment, which you can drop. That is not the same as saying there are no facts.",
    ))
    items.append(q(
        "If you are distressed by anything external, the pain is not due to the thing itself, but to your estimate of it; and this you have the power to revoke at any moment.",
        "Genuine close translation of 8.47, slightly modernized.",
        "<b>Long, 8.47:</b> “If thou art pained by any external thing, it is not this thing that disturbs thee, but thy own judgment about it. And it is in thy power to wipe out this judgment now.” Haines: “And this thou canst annul in a moment.”",
        "The hurt is in the judgment, and you can cancel that judgment now.",
    ))
    items.append(q(
        "Waste no more time arguing what a good man should be. Be one.",
        "Genuine close translation of 10.16. Haines is already nearly this wording.",
        "<b>Long, 10.16:</b> “No longer talk at all about the kind of man that a good man ought to be, but be such.” <b>Haines:</b> “Put an end once for all to this discussion of what a good man should be, and be one.”",
        "Stop describing the good person. Be one.",
    ))
    items.append(q(
        "The impediment to action advances action. What stands in the way becomes the way.",
        "Genuine idea, modern wording of 5.20. The exact poster phrasing is Gregory Hays (2002), later popularized by Ryan Holiday. Casaubon, already in 1634, is strikingly close.",
        "<b>Long, 5.20:</b> “…that which is a hindrance is made a furtherance to an act; and that which is an obstacle on the road helps us on this road.” <b>Casaubon:</b> “…that which before was in her way, is now her readiest way.”",
        "A well-trained mind can turn an obstacle into the work itself.",
    ))
    items.append(q(
        "The best revenge is to be unlike him who performed the injury.",
        "Genuine close translation of 6.6.",
        "<b>Long, 6.6:</b> “The best way of avenging thyself is not to become like [the wrong-doer].” Haines: “not to do likewise.”",
        "Do not copy the person who wronged you. That is the better revenge.",
    ))
    items.append(q(
        "Be tolerant with others and strict with yourself.",
        "Genuine idea, modern wording of 5.33, the old Stoic pair “bear and forbear” (ἀνέχου καὶ ἀπέχου). “Strict with yourself” is a somewhat interpretive rendering of self-restraint. A related idea appears in 10.30, but that section is not this sentence, and 5.10 is not a match.",
        "<b>Long, 5.33:</b> “…to do good to men, and to practise tolerance and self-restraint.” Haines: “to bear with them and forbear.”",
        "Be patient with other people, and keep a tight rein on yourself.",
    ))
    items.append(q(
        "Loss is nothing else but change, and change is Nature’s delight.",
        "Genuine close translation of 9.35, slightly compressed.",
        "<b>Long, 9.35:</b> “Loss is nothing else than change. But the universal nature delights in change…”",
        "What you call loss is change, and change is how the world works.",
    ))
    items.append(q(
        "How soon will time cover all things and how many has it covered already.",
        "Genuine close translation of 6.59. Long is almost word for word.",
        "<b>Long, 6.59:</b> “How soon will time cover all things, and how many it has covered already.”",
        "Forgetfulness comes quickly, and it has already swallowed most of what people once made a fuss over.",
    ))
    items.append(q(
        "He who follows reason in all things is both tranquil and active at the same time, and also cheerful and collected.",
        "Genuine close translation of 10.12. This is not a loose paraphrase. The last sentence of Long’s 10.12 is this line, essentially verbatim.",
        "<b>Long, 10.12:</b> “He who follows reason in all things is both tranquil and active at the same time, and also cheerful and collected.”",
        "Following reason does not mean going limp. It is a calm, ready, and even cheerful way of acting.",
    ))

    html_doc = f"""<!DOCTYPE html>
<html lang="en">
<meta charset="utf-8">
<title>Marcus Aurelius Quotes, Checked Against Meditations</title>
<style>{CSS}</style>
<body>
<p class="kicker">A lesson from faria.jbf.com  ·  27 November 2026</p>
<h1>Marcus Aurelius Quotes, Checked Against&nbsp;Meditations</h1>
<div class="hero">
  <img src="{img_src}" alt="Equestrian statue of Marcus Aurelius, Capitoline replica, head">
  <p class="cap">Detail of the bronze equestrian statue of Marcus Aurelius. Modern replica, Piazza del Campidoglio, Rome; the late-second-century original is indoors at the Capitoline Museums. Photograph by Jebulon, CC0, via Wikimedia Commons.</p>
</div>
<p class="lede">Marcus Aurelius Antoninus (26 April 121 – 17 March 180 AD) was Roman emperor from 161 until his death, on campaign in the Danube lands. The private notes we call <i>Meditations</i> were written in Greek, not Latin, and were never given a title by him. The manuscripts call them <i>To Himself</i> (τὰ εἰς ἑαυτόν). Some books were written in the field: Book 2 is headed “among the Quadi,” Book 3 “at Carnuntum.”</p>
<p>English “quotes” are always someone’s translation. This page checks twelve popular lines against Meric Casaubon (1634), George Long (1862), and C. R. Haines (1916, the Loeb edition). Citations use the usual book and section numbers, so 8.47 means Book 8, section 47. Gregory Hays’s 2002 translation often supplies the punchiest modern wording; it is still in copyright, so it is named but not quoted here.</p>
<div class="callout">
<p><b>How to spot a fake quote.</b> Demand a book and section. If a site only says “Marcus Aurelius,” be suspicious. Then open a public-domain translation—Long on Wikisource, Haines in the Loeb, or Casaubon—and read the surrounding sentences, not just a clipped line. Punchy modern English is often a recent translator, or a meme. If a line turns a Stoic point about <i>judgment</i> into a slogan about “facts versus perspectives,” it has probably been rewritten.</p>
</div>
<h2>Mind and Perspective</h2>
{''.join(items[:4])}
<h2>Action and Character</h2>
{''.join(items[4:8])}
<h2>Change and Time</h2>
{''.join(items[8:])}
<p><b>Question.</b> Now that you have the real wording beside the poster lines, which one still belongs over a desk—and in which translation?</p>
<p><b>Question.</b> Want a second batch checked the same way, or shall we go on to Epictetus, whose <i>Handbook</i> is the other half of this toolkit?</p>
<div class="sources">
<h2>Sources and links</h2>
<ul>
<li>The live lesson: https://faria.jbf.com/topics/143-marcus-aurelius-quotes-checked-against-meditations/</li>
<li>Socrates: https://faria.jbf.com/topics/124-socrates-gadfly-of-athens/</li>
<li>Why questioning authority: https://faria.jbf.com/topics/125-why-questioning-authority-socrates-to-darwin/</li>
<li>Aristotle: https://faria.jbf.com/topics/126-aristotle-master-of-those-who-know/</li>
<li>Aristotle’s Doctrine of the Mean: https://faria.jbf.com/topics/127-aristotle-doctrine-of-the-mean/</li>
<li>George Long, <i>The Thoughts of the Emperor Marcus Aurelius Antoninus</i> (1862): https://en.wikisource.org/wiki/The_Thoughts_of_the_Emperor_Marcus_Aurelius_Antoninus</li>
<li>C. R. Haines, <i>The Communings with Himself of Marcus Aurelius Antoninus</i> (1916, Loeb): https://en.wikisource.org/wiki/The_communings_with_himself_of_Marcus_Aurelius_Antoninus</li>
<li>Meric Casaubon, <i>Meditations</i> (1634; Everyman reprint): https://archive.org/details/meditations00marcuoft</li>
</ul>
</div>
</body>
</html>
"""
    OUT.parent.mkdir(parents=True, exist_ok=True)
    HTML(string=html_doc, base_url=str(ROOT)).write_pdf(str(OUT))
    print("wrote", OUT, "bytes", OUT.stat().st_size)


if __name__ == "__main__":
    main()
