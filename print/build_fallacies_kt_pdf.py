#!/usr/bin/env python3
"""Build the 26 November 2026 fallacies and Kahneman-Tversky refresher PDF.

Cream page, serif type, rust headings. Header: faria.jbf.com and jbf@jbf.com.
Live links appear only in the final Sources and Links section.
"""
import re
import pathlib
from weasyprint import HTML

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "downloads" / "Logical_Fallacies_and_Kahneman_Tversky_Biases_Refresher_Faria_2026-11-26.pdf"
SVG = ROOT / "public" / "img" / "Fallacies_and_Biases_Cousins_Chart_Faria_2026-11-26.svg"

CSS = """
@page {
  size: letter;
  margin: 0.62in 0.66in 0.58in 0.66in;
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
  font-size: 11pt;
  line-height: 1.38;
  color: #22201c;
}
h1 {
  font-family: "Liberation Serif", Georgia, serif;
  font-weight: normal;
  font-size: 22pt;
  line-height: 1.15;
  color: #7a4b1e;
  margin: 0 0 0.10in;
}
h2 {
  font-family: "Liberation Serif", Georgia, serif;
  font-weight: normal;
  font-size: 14.5pt;
  line-height: 1.22;
  color: #7a4b1e;
  margin: 0.16in 0 0.05in;
  break-after: avoid;
}
h3 {
  font-family: "Liberation Serif", Georgia, serif;
  font-weight: normal;
  font-size: 12.2pt;
  color: #7a4b1e;
  margin: 0.11in 0 0.03in;
  break-after: avoid;
}
p { margin: 0 0 0.07in; }
ul, ol { margin: 0.03in 0 0.10in; padding-left: 0.22in; }
li { margin: 0.03in 0; }
a { color: #7a4b1e; text-decoration: none; }
.kicker {
  font-size: 10pt;
  color: #6b645a;
  margin: 0 0 0.08in;
}
figure { margin: 0.06in 0 0.04in; break-inside: avoid; }
figure svg { width: 100%; height: auto; max-height: 6.4in; display: block; }
p.cap {
  font-size: 9pt;
  line-height: 1.3;
  color: #6b645a;
  margin: 0 0 0.10in;
  break-before: avoid;
}
.chartblock { break-inside: avoid; }
p.item { margin: 0 0 0.09in; }
strong { font-weight: bold; }
em { font-style: italic; }
.src { font-size: 10pt; line-height: 1.35; margin: 0 0 0.05in; }
"""

svg = re.sub(r"<\?xml[^>]*>\s*", "", SVG.read_text(encoding="utf-8"))

html = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Logical Fallacies and Kahneman-Tversky Biases: A Refresher</title>
<style>{CSS}</style>
</head>
<body>
<p class="kicker">faria.jbf.com · jbf@jbf.com · 26 November 2026</p>
<h1>Logical Fallacies and Kahneman-Tversky Biases: A Refresher</h1>

<p>A fallacy is a move in an argument. A bias is a tilt in the mind. They often travel together, and they are not the same thing. This sheet is a printable refresh of the section published on faria.jbf.com on 26 November 2026. It continues the Kahneman and Tversky thread that began on the evening of 8 November 2026 and continued, on 20 November, with the peak-end rule.</p>

<p>The tightest overlap is the conjunction fallacy. A combination of two facts cannot be more likely than one of those facts alone. In the Linda problem of 1983, “feminist bank teller” feels more likely than “bank teller,” because it better matches the story. That is a bias, representativeness, doing the work of a fallacy.</p>

<p>When a number appears below, it comes from a named paper. No quotations are invented. Live page addresses and the full source list are at the end, and only at the end.</p>

<div class="chartblock">
<h2>Where a Fallacy and a Bias Are Cousins</h2>
<p>The pairs are cousins, not twins. A few debate tricks have no close cousin in this research. Those are still in the fallacies list.</p>
<figure>{svg}</figure>
</div>

<h2>Fourteen Classic Fallacies</h2>
<p>These are moves in an argument. Naming one helps when it reveals the move, not when it ends the talk. “Begging the question” means assuming what you set out to prove. It does not mean “this raises a question.”</p>

<p class="item"><strong>Straw man.</strong> You knock down a weaker copy of the other person’s view, not the view itself. Example: “We should tighten the requirements for this license.” Reply: “So you want to ban ordinary people from doing their jobs.” Spot it: Did they actually claim that? Self-test: Restate their view in a form they would accept.</p>

<p class="item"><strong>Ad hominem.</strong> You attack the person instead of the claim. Example: “Don’t listen to her budget numbers. She just wants the promotion.” Spot it: If someone you liked said the same thing, would you still dismiss it? The cousin is the halo effect.</p>

<p class="item"><strong>Appeal to authority.</strong> You treat a name or a title as if it settled the question. Example: “A well-known consultant says this plan will work, so it will.” Spot it: Are they expert on this exact question, and what is the evidence besides the name? Self-test: Remove the name. Does the argument still stand?</p>

<p class="item"><strong>False dilemma.</strong> You offer two options as if they were the only ones. Example: “Either we cut the program entirely, or we leave it untouched.” Spot it: What is a third way? The cousin is WYSIATI: only the options in view feel real.</p>

<p class="item"><strong>Slippery slope.</strong> You say that one step will, by an unbroken chain, lead to a dire end, without showing why the chain has to hold. Example: “If we allow this exception, soon there will be no rule left at all.” Self-test: Break the chain into three links. If any link is only a fear, the slope is not yet an argument. Mainly a debate trick.</p>

<p class="item"><strong>Begging the question.</strong> You assume, in your reason, the very thing you are trying to prove. Example: “This policy is fair because it treats people fairly.” Spot it: Did the reason sneak in the conclusion under other words? A logic error, not a Kahneman and Tversky finding.</p>

<p class="item"><strong>Post hoc</strong> (<em>post hoc, ergo propter hoc</em>, “after this, therefore because of this”). You treat what came first as the cause of what came next. Example: “We launched the new slogan on Monday, and sales rose on Tuesday, so the slogan worked.” Self-test: Name two other causes that could have produced the same result.</p>

<p class="item"><strong>Hasty generalization.</strong> You draw a wide conclusion from a small, or badly chosen, handful of cases. Example: “I met two rude clerks in that office, so the whole office is rude.” The close cousin is the law of small numbers.</p>

<p class="item"><strong>Red herring.</strong> You drag the talk onto a side issue that is easier, or hotter, than the question at hand. Example: “We can discuss the delay later. Have you seen how hard the team has been working?” Spot it: Write the original question in one sentence. If the last remark does not touch it, it is a herring.</p>

<p class="item"><strong>Tu quoque</strong> (“you too”). You answer a charge by pointing at the other person’s similar fault. Example: “You say I missed the deadline, but you missed one last spring.” Both can be true. The second does not erase the first. A cousin of ad hominem.</p>

<p class="item"><strong>No true Scotsman.</strong> You protect a sweeping claim by shrinking the group after a counterexample appears. Example: “No engineer would miss that check.” “Dana missed it.” “Well, no <em>true</em> engineer would.” A definition move, not a named bias in the 1974 paper.</p>

<p class="item"><strong>Bandwagon.</strong> You treat popularity as proof. Example: “Everyone is switching to this tool, so it must be the right one.” Self-test: List the reasons that do not mention other people. Availability can make a crowd feel like evidence.</p>

<p class="item"><strong>Appeal to nature.</strong> You treat “natural” as if it meant “good” or “safe.” Example: “This remedy is natural, so it is safer than the medicine.” Poison ivy is natural. Many useful medicines are made in a lab. The cousin is representativeness: what seems typical or pure feels right.</p>

<p class="item"><strong>The Texas sharpshooter.</strong> You fire first, then draw the bull’s-eye around the tightest cluster of holes. Example: A report looks at twenty possible patterns, finds two that look striking, and writes the story as if those two had been the question all along. Spot it: Was this pattern predicted before the data were seen, or found afterward? The cousin is seeing patterns in randomness.</p>

<h2>Mental Shortcuts: System 1, WYSIATI, and the Three Heuristics</h2>

<p>In 1974, Amos Tversky and Daniel Kahneman published “Judgment under Uncertainty: Heuristics and Biases” in <em>Science</em>. The shortcuts, they wrote, are highly economical and usually effective, and they also lead to systematic errors. A fast answer is not a wrong answer by default.</p>

<h3>System 1 and System 2</h3>
<p>In <em>Thinking, Fast and Slow</em> (2011), Kahneman describes two ways of thinking. System 1 is fast, automatic, and often effortless. It offers a first answer. System 2 is slower and more deliberate. It can check that answer, or fail to. The labels were proposed by Keith Stanovich and Richard West in 2000. Kahneman adopted them. Nothing in this account says that a person has two brains.</p>
<p>The bat-and-ball puzzle, already worked on 8 November 2026, is a small picture of the two. A bat and a ball cost $1.10 together. The bat costs $1.00 more than the ball. Ten cents arrives quickly. It does not survive a check. Five cents does. The puzzle is Shane Frederick’s, from 2005, not a Kahneman and Tversky invention. Spot it: Notice the first answer, then ask whether you have tested it.</p>

<h3>WYSIATI</h3>
<p>WYSIATI is Kahneman’s phrase from the 2011 book: “what you see is all there is.” The mind builds a coherent story from the information in view, and it is not naturally designed to ask what is missing. A clear story feels true, even when the file is thin. Self-test: Name one fact that, if it came to light, would change the story. False dilemma and straw man live here too: only the options, or the substitute, are in view.</p>

<h3>Anchoring</h3>
<p>You start from a number that is already on the table, and you do not move far enough away from it, even when the number is random. In the 1974 paper, people spun a wheel of fortune that was rigged to stop at 10 or at 65, and were then asked for the percentage of African countries in the United Nations. Those who saw 10 gave a median estimate of 25. Those who saw 65 gave a median estimate of 45. The wheel could not have been information. It still pulled the answers. Self-test: Hide the first number and estimate again.</p>

<h3>Availability</h3>
<p>You judge how common or how likely something is by how easily examples come to mind. Tversky and Kahneman developed this in a 1973 paper in <em>Cognitive Psychology</em>, and restated it in 1974. After a plane crash is in the news, flying can feel more dangerous that week, even if the year’s risk has not changed. Spot it: Is this easy to recall because it is common, or because it is vivid?</p>

<h3>Representativeness</h3>
<p>You judge the chance of a category, or of a cause, by how much the case resembles a stereotype of that category. In the 1974 paper this is the master shortcut behind Linda, base-rate neglect, the law of small numbers, and the gambler’s fallacy. A quiet, tidy person is judged more likely to be a librarian than a salesperson, even in a world with many more salespeople than librarians. The resemblance is real. The base rate still matters. Spot it: Does this match a picture in my head, and have I also asked how common that picture really is?</p>

<h2>Probability Traps</h2>
<p>None of these examples needs a formula. Each one can be held as a count of people, days, or landings.</p>

<h3>The Conjunction Fallacy, and Linda</h3>
<p>Linda is 31 years old, single, outspoken, and very bright. She majored in philosophy. As a student she was deeply concerned with issues of discrimination and social justice, and also participated in anti-nuclear demonstrations. Which is more likely: (1) Linda is a bank teller, or (2) Linda is a bank teller and is active in the feminist movement?</p>
<p>In the most direct version of the problem, 85 percent of 142 undergraduates chose the second statement (Tversky and Kahneman, <em>Psychological Review</em>, 1983). The second cannot be more likely. Every feminist bank teller is already a bank teller.</p>
<p>Here is the same point as a count. Imagine 100 women who fit Linda’s description. Suppose 8 of them are bank tellers, and 6 of those 8 are also active in the feminist movement. Six cannot be more than eight. The story makes option 2 <em>feel</em> larger. The count will not let it be. Self-test: Cover the story and keep only the two labels. Which set can possibly be larger?</p>

<h3>Base-Rate Neglect, and the Cab Problem</h3>
<p>You pay too little attention to how common a category is, and too much to a specific resemblance or a single witness. Kahneman and Tversky developed this in “On the Psychology of Prediction” (1973). A later, widely taught version is the cab problem, from work collected in 1982.</p>
<p>A city has 85 green cabs and 15 blue cabs, out of every 100. A witness says a cab in an accident was blue. The witness is right 80 times out of 100, and wrong 20 times out of 100. How likely is it that the cab was blue?</p>
<p>Many people say “about 80 in 100,” as if the witness’s accuracy were the whole story. Start with the 100 cabs. Of the 85 green cabs, the witness will wrongly call 20 in 100 of them blue: that is 17 green cabs called blue. Of the 15 blue cabs, the witness will rightly call 80 in 100 of them blue: that is 12 blue cabs called blue. So when the witness says “blue,” we have 12 true blues and 17 false blues, 12 out of 29. That is a little over 40 in 100, not 80 in 100. The witness still matters. The base rate matters too.</p>

<h3>The Law of Small Numbers</h3>
<p>You expect a small sample to look just like the whole. Tversky and Kahneman named this belief in 1971, and restated it in 1974. A town has two hospitals. About 45 babies are born each day in the larger one, and about 15 in the smaller one. For a year, each hospital recorded the days on which more than 60 percent of the babies born were boys. Which hospital recorded more such days?</p>
<p>Most people say about the same. The smaller hospital will have more of those days. A small count swings more. A large count stays closer to half and half. That is why hasty generalization is a cousin: two rude clerks are a small hospital. Self-test: Would you trust a batting average after four at-bats the same way you trust one after four hundred?</p>

<h3>The Gambler’s Fallacy, and the Hot Hand</h3>
<p>After a run of one outcome, people often feel that the other outcome is “due.” That is the gambler’s fallacy, already in the 1974 paper. If a fair coin has come up heads five times, the next flip is still one in two. The coin does not keep a tab.</p>
<p>The hot hand is the feeling in the other direction: after a run of hits, the next one feels more likely because the person is “hot.” In 1985, Thomas Gilovich, Robert Vallone, and Amos Tversky studied basketball shooting and concluded that, in the records they examined, the hot hand was largely an illusion. Later work, especially by Joshua Miller and Adam Sanjurjo in 2018, has argued that the original analysis was tilted against finding a real hot hand. The 1985 claim is the starting point. The question is not fully closed. A fair coin has no memory. A tired shooter, or a changed defense, might.</p>

<h3>Regression to the Mean, and the Flight Instructors</h3>
<p>An extreme result is often followed by a more ordinary one, just because extremes are unusual. That is regression to the mean. It needs no reward and no punishment to happen.</p>
<p>Kahneman tells the story of Israeli flight instructors in <em>Thinking, Fast and Slow</em>, and in his 2002 Nobel lecture. The instructors found that praise after a good landing was often followed by a worse one, and that criticism after a poor landing was often followed by a better one. They concluded that praise hurts and criticism helps. A more ordinary landing was likely either way: extremes tend to be followed by something closer to the average. Self-test: A student scores 98, then 88. Is that a decline you must explain, or the usual settling after an unusually high score?</p>

<h2>Risk, Frames, and Later Judgment</h2>
<p>The 1979 <em>Econometrica</em> paper, “Prospect Theory: An Analysis of Decision under Risk,” is about choice. Several later ideas were pursued by Kahneman, by Tversky, or by colleagues, and are gathered in the 2011 book.</p>

<h3>Prospect Theory, and Loss Aversion</h3>
<p>People treat outcomes as gains or losses from a reference point, not as final wealth. And they feel losses more sharply than gains of the same size. That second point is loss aversion. A sure gain is often preferred to a risky chance with the same average. A sure loss is often avoided by taking a risk. Example: many people will take a sure $100 rather than a coin flip between $200 and nothing. Facing a sure loss of $100, many of the same people will take a coin flip between losing $200 and losing nothing. The facts are mirrored. The choices are not. Spot it: Am I treating this as a gain or as a loss, and from what starting point?</p>

<h3>Framing, and the Asian Disease</h3>
<p>In 1981, in <em>Science</em>, Tversky and Kahneman showed that the wording of a choice can reverse it while the facts stay the same. Students at Stanford and at the University of British Columbia answered short questionnaires in class. Imagine that the United States is preparing for the outbreak of an unusual Asian disease, which is expected to kill 600 people.</p>
<p>Of 152 people who read the “lives saved” wording, 72 percent chose Program A: 200 people will be saved. The rest chose Program B: a one-in-three chance that all 600 are saved, and a two-in-three chance that no one is saved. Of 155 people who read the “lives lost” wording, only 22 percent chose Program C: 400 people will die. 78 percent chose Program D: a one-in-three chance that no one dies, and a two-in-three chance that all 600 die.</p>
<p>A and C are the same fact: 200 live, 400 die. B and D are the same gamble. The “saved” frame pulled people toward the sure option. The “die” frame pulled them toward the risk. The paper also reports the same reversal among university faculty and physicians. Self-test: Without looking back, would you take A or B? Now C or D? If the two answers disagree, you have just met framing.</p>

<h3>The Endowment Effect</h3>
<p>Once a thing is yours, you often demand more to give it up than you would have paid to acquire it. Richard Thaler named the endowment effect. Kahneman, Jack Knetsch, and Thaler tested it in 1990, at Cornell, with coffee mugs. People who had just been given a mug asked roughly twice as much to sell it as people without a mug were willing to pay. Ownership had shifted the reference point. Giving up the mug is coded as a loss. Self-test: Would I pay this much to get it, if I did not already have it?</p>

<h3>Sunk Cost</h3>
<p>You let a cost that cannot be recovered decide the next step, as if spending more could un-spend the past. This is not a Kahneman and Tversky paper. The classic study is by Hal Arkes and Catherine Blumer, in 1985: people who had paid more for a theater series attended more plays, and people who had paid for a weekend trip were reluctant to skip it for a trip they would actually enjoy more. The pattern sits near loss aversion. Example: “We have already spent so much on this plan that we have to finish it.” The money is gone either way. The only question is whether the next dollar, or the next month, is still well spent. Self-test: If I arrived today with no past spending, would I start this now?</p>

<h3>The Planning Fallacy</h3>
<p>People understate how long a job will take, and how much it will cost, when they look at it from the inside. Kahneman and Tversky described this in 1979, in “Intuitive Prediction: Biases and Corrective Procedures.” The remedy they pointed to is an outside view: how long did similar jobs actually take? In <em>Thinking, Fast and Slow</em>, Kahneman tells of a team, including himself, that set out to write a textbook and estimated about two years. A colleague who had seen similar projects said that about 40 percent never finished, and that those that did took seven to ten years. The book took eight years, and was never used. Self-test: Name one plan you have now. What would a similar-case history say?</p>

<h3>The Halo Effect</h3>
<p>A single impression of a person or a thing — good or bad — spills onto traits you have not observed. Edward Thorndike named the halo effect in 1920, in a paper on officers’ ratings of their men. Kahneman uses it in the 2011 book as a way the mind keeps a story consistent. A clear, confident speaker is also judged more competent on the substance, before the substance has been checked. The reverse halo is the ad hominem. An appeal to authority can be a halo in the other direction. Self-test: Which trait did I actually see, and which traits did I fill in?</p>

<h3>Hindsight, and Outcome Bias</h3>
<p>Hindsight is the feeling, after the fact, that the outcome was more predictable than it was. Baruch Fischhoff documented it in 1975: once you know what happened, the past looks as if it pointed that way all along. “I knew it all along” is the everyday sentence. Outcome bias, named by Jonathan Baron and John Hershey in 1988, is a close neighbor: you judge a decision by how it turned out, not by what was known when it was made. A careful choice can end badly. A careless one can end well. The result is not a verdict on the choice. Self-test: Take a decision that turned out badly. Can you describe the information as it stood before the result?</p>

<h3>Overconfidence</h3>
<p>People are often too sure of their judgments, especially when the story is clear and the evidence is thin. Confidence tracks the coherence of the story more than the completeness of the file. Griffin and Tversky, in 1992, found overconfidence in some conditions and underconfidence in others: the pattern is not “people are always too sure.” Self-test: Give a range you are “almost sure” contains the right figure. Then ask whether, in a set of ten such ranges, about nine would actually contain it. WYSIATI is again in the background: a tidy story feels like a sufficient one.</p>

<h2>Two Questions for a Refresh</h2>
<ol>
<li>In the Linda problem, which statement did you pick first, and can you now say why the other statement has to be at least as likely?</li>
<li>Without looking back, would you take Program A or Program B in the Asian-disease problem? Now Program C or Program D? If your answers flipped, you have just met framing.</li>
</ol>

<h2>Sources and Links</h2>
<p class="src">The live lessons on faria.jbf.com:</p>
<p class="src">https://faria.jbf.com/topics/138-logical-fallacies-and-kahneman-tversky-biases/</p>
<p class="src">https://faria.jbf.com/topics/139-fourteen-classic-fallacies/</p>
<p class="src">https://faria.jbf.com/topics/140-mental-shortcuts-system-1-wysiati-and-the-three-heuristics/</p>
<p class="src">https://faria.jbf.com/topics/141-probability-traps-linda-base-rates-and-regression/</p>
<p class="src">https://faria.jbf.com/topics/142-risk-frames-and-later-judgment/</p>
<p class="src">The study thread: https://faria.jbf.com/topics/85-kahneman-tversky-the-first-evening/ and https://faria.jbf.com/topics/120-peak-end-rule/</p>
<p class="src">Amos Tversky and Daniel Kahneman, “Belief in the Law of Small Numbers,” <em>Psychological Bulletin</em> 76, no. 2 (1971): 105–110.</p>
<p class="src">Daniel Kahneman and Amos Tversky, “On the Psychology of Prediction,” <em>Psychological Review</em> 80 (1973): 237–251.</p>
<p class="src">Amos Tversky and Daniel Kahneman, “Availability: A Heuristic for Judging Frequency and Probability,” <em>Cognitive Psychology</em> 5 (1973): 207–232.</p>
<p class="src">Amos Tversky and Daniel Kahneman, “Judgment under Uncertainty: Heuristics and Biases,” <em>Science</em> 185, no. 4157 (27 September 1974): 1124–1131.</p>
<p class="src">Daniel Kahneman and Amos Tversky, “Prospect Theory: An Analysis of Decision under Risk,” <em>Econometrica</em> 47, no. 2 (March 1979): 263–291.</p>
<p class="src">Daniel Kahneman and Amos Tversky, “Intuitive Prediction: Biases and Corrective Procedures,” <em>TIMS Studies in Management Science</em> 12 (1979): 313–327.</p>
<p class="src">Amos Tversky and Daniel Kahneman, “The Framing of Decisions and the Psychology of Choice,” <em>Science</em> 211, no. 4481 (30 January 1981): 453–458.</p>
<p class="src">Amos Tversky and Daniel Kahneman, “Evidential Impact of Base Rates,” in <em>Judgment under Uncertainty: Heuristics and Biases</em>, ed. Daniel Kahneman, Paul Slovic, and Amos Tversky (Cambridge: Cambridge University Press, 1982), 153–160.</p>
<p class="src">Amos Tversky and Daniel Kahneman, “Extensional Versus Intuitive Reasoning: The Conjunction Fallacy in Probability Judgment,” <em>Psychological Review</em> 90, no. 4 (October 1983): 293–315.</p>
<p class="src">Thomas Gilovich, Robert Vallone, and Amos Tversky, “The Hot Hand in Basketball: On the Misperception of Random Sequences,” <em>Cognitive Psychology</em> 17 (1985): 295–314.</p>
<p class="src">Hal R. Arkes and Catherine Blumer, “The Psychology of Sunk Cost,” <em>Organizational Behavior and Human Decision Processes</em> 35 (1985): 124–140.</p>
<p class="src">Daniel Kahneman, Jack L. Knetsch, and Richard H. Thaler, “Experimental Tests of the Endowment Effect and the Coase Theorem,” <em>Journal of Political Economy</em> 98, no. 6 (1990): 1325–1348.</p>
<p class="src">Dale Griffin and Amos Tversky, “The Weighing of Evidence and the Determinants of Confidence,” <em>Cognitive Psychology</em> 24 (1992): 411–435.</p>
<p class="src">Keith E. Stanovich and Richard F. West, “Individual Differences in Reasoning: Implications for the Rationality Debate?” <em>Behavioral and Brain Sciences</em> 23 (2000): 645–665.</p>
<p class="src">Shane Frederick, “Cognitive Reflection and Decision Making,” <em>Journal of Economic Perspectives</em> 19, no. 4 (2005): 25–42.</p>
<p class="src">Joshua B. Miller and Adam Sanjurjo, “Surprised by the Hot Hand Fallacy? A Truth in the Law of Small Numbers,” <em>Econometrica</em> 86, no. 6 (2018): 2019–2047.</p>
<p class="src">Edward L. Thorndike, “A Constant Error in Psychological Ratings,” <em>Journal of Applied Psychology</em> 4 (1920): 25–29.</p>
<p class="src">Baruch Fischhoff, “Hindsight Is Not Equal to Foresight,” <em>Journal of Experimental Psychology: Human Perception and Performance</em> 1 (1975): 288–299.</p>
<p class="src">Jonathan Baron and John C. Hershey, “Outcome Bias in Decision Evaluation,” <em>Journal of Personality and Social Psychology</em> 54 (1988): 569–579.</p>
<p class="src">Daniel Kahneman, <em>Thinking, Fast and Slow</em> (New York: Farrar, Straus and Giroux, 2011). The flight-instructor story is also in Kahneman’s Nobel lecture, “Maps of Bounded Rationality,” 2002.</p>
<p class="src">Richard H. Thaler named the endowment effect; the 1990 mug experiment is the test cited above. The names of the classic fallacies are the common stock of informal logic.</p>
</body>
</html>
"""

OUT.parent.mkdir(parents=True, exist_ok=True)
HTML(string=html, base_url=str(ROOT)).write_pdf(str(OUT))
print(OUT.name, OUT.stat().st_size)
