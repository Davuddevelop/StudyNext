$text = @'
There is nothing unusual about a single language dying. Communities have come and gone throughout history, and with them their language. But what is happening today is extraordinary, judged by the standards of the past. It is language extinction on a massive scale. According to the best estimates, there are some 6,000 languages in the world. Of these, about half are going to die out in the course of the next century: that’s 3,000 languages in 1,200 months. On average, there is a language dying out somewhere in the world every two weeks or so.

How do we know? In the course of the past two or three decades, linguists all over the world have been gathering comparative data. If they find a language with just a few speakers left, and nobody is bothering to pass the language on to the children, they conclude that language is bound to die out soon. And we have to draw the same conclusion if a language has less than 100 speakers. It is not likely to last very long. A 1999 survey shows that 97 per cent of the world’s languages are spoken by just four per cent of the people.

It is too late to do anything to help many languages, where the speakers are too few or too old, and where the community is too busy just trying to survive to care about their language. But many languages are not in such a serious position. Often, where languages are seriously endangered, there are things that can be done to give new life to them. It is called revitalisation.

Once a community realises that its language is in danger, it can start to introduce measures which can genuinely revitalise. The community itself must want to save its language. The culture of which it is a part must need to have a respect for minority languages. There needs to be funding, to support courses, materials, and teachers. And there need to be linguists, to get on with the basic task of putting the language down on paper. That’s the bottom line: getting the language documented - recorded, analysed, written down. People must be able to read and write if they and their language are to have a future in an increasingly computer- literate civilisation.Books & Literature

But can we save a few thousand languages, just like that? Yes, if the will and funding were available. It is not cheap, getting linguists into the field, training local analysts, supporting the community with language resources and teachers, compiling grammars and dictionaries, writing materials for use in schools. It takes time, lots of it, to revitalise an endangered language. Conditions vary so much that it is difficult to generalise, but a figure of $ 100,000 a year per language cannot be far from the truth. If we devoted that amount of effort over three years for each of 3,000 languages, we would be talking about some $900 million.

There are some famous cases which illustrate what can be done. Welsh, alone among the Celtic languages, is not only stopping its steady decline towards extinction but showing signs of real growth. Two Language Acts protect the status of Welsh now, and its presence is increasingly in evidence wherever you travel in Wales.

On the other side of the world, Maori in New Zealand has been maintained by a system of so- called ‘language nests’, first introduced in 1982. These are organisations which provide children under five with a domestic setting in which they are intensively exposed to the language. The staff are all Maori speakers from the local community. The hope is that the children will keep their Maori skills alive after leaving the nests, and that as they grow older they will in turn become role models to a new generation of young children. There are cases like this all over the world. And when the reviving language is associated with a degree of political autonomy, the growth can be especially striking, as shown by Faroese, spoken in the Faroe Islands, after the islanders received a measure of autonomy from Denmark.

In Switzerland, Romansch was facing a difficult situation, spoken in five very different dialects, with small and diminishing numbers, as young people left their community for work in the German-speaking cities. The solution here was the creation in the 1980s of a unified written language for all these dialects. Romansch Grischun, as it is now called, has official status in parts of Switzerland, and is being increasingly used in spoken form on radio and television.

A language can be brought back from the very brink of extinction. The Ainu language of Japan, after many years of neglect and repression, had reached a stage where there were only eight fluent speakers left, all elderly. However, new government policies brought fresh attitudes and a positive interest in survival. Several ‘semispeakers’ - people who had become unwilling to speak Ainu because of the negative attitudes by Japanese speakers - were prompted to become active speakers again. There is fresh interest now and the language is more publicly available than it has been for years.

If good descriptions and materials are available, even extinct languages can be resurrected. Kaurna, from South Australia, is an example. This language had been extinct for about a century, but had been quite well documented. So, when a strong movement grew for its revival, it was possible to reconstruct it. The revised language is not the same as the original, of course. It lacks the range that the original had, and much of the old vocabulary. But it can nonetheless act as a badge of present-day identity for its people. And as long as people continue to value it as a true marker of their identity, and are prepared to keep using it, it will develop new functions and new vocabulary, as any other living language would do.

It is too soon to predict the future of these revived languages, but in some parts of the world they are attracting precisely the range of positive attitudes and grass roots support which are the preconditions for language survival. In such unexpected but heart-warming ways might we see the grand total of languages in the world minimally increased.
'@

try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $true
    $word.Activate()
    $doc = $word.Documents.Add()
    $selection = $word.Selection

    $tokens = [regex]::Split($text, '(\s+)')
    foreach ($token in $tokens) {
        if ([string]::IsNullOrEmpty($token)) { continue }
        $selection.TypeText($token)
        Start-Sleep -Milliseconds (Get-Random -Minimum 30 -Maximum 100)
    }
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}
