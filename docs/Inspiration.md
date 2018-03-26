# Inspiration

Elegant form validation is something that product owners and user experience designers always expect, but it is surprisingly hard to implement. Moreover, many developers and most validation libraries only provide client-side functionality, which falls terribly short of being a well-rounded or even secure approach.

Going all the way back to jQuery UI Validation, web developers have implemented validation in their client-side JavaScript UI code. We've annotated `<input>` elements with attributes that define the rules. We've created giant libraries that integrate deeply with our UI frameworks. And we've convinced ourselves that these approaches ensure data integrity.

For applications built using universal JavaScript including Node, React, Redux, and GraphQL, it was time for a robust validation framework to be created.

## UI-Centric Validation Falls Short

Using a UI-centric validation library is not just a bad idea; it's a terrible idea.

* Your validation rules are coupled to your rendering logic
* Any change to your UI library choices means you must re-implement your validation code
* Validation rules, which are often the heart of business logic, become difficult to unit test
* Rules end up being scattered across your codebase throughout your UI components
* It becomes challenging to manage your validation logic neatly
* Attempts to centralize the logic often lead to giant validation modules that are complex and hard to maintain

More important than how UI-centric validation badly influences your code factoring, it also points your project in a direction where data integrity and even security are compromised by default.

## Never Trust the Client

Servers should never trust data from the client. Every service that receives data must perform server-side validation to ensure the data is valid. If the service does not validate data it receives, your application _will_ end up with data integrity bugs.

**If a malicious user can bypass validation and introduce corrupt data into your system, then it is just a matter of time before a _bug_ exploits the vulnerability.**

If this concept is new to you, a web search for "never trust the client" will provide you with plenty of additional reading material. Not trusting the client is the most important reason why UI-centric validation is a terrible idea.

## Duplicate Implementation Woes

If you've built validation into your client-side code, but you knew not to trust the client, then you've likely duplicated your validation implementations across the client and server. And you've been frustrated by the burden, for at least one of the reasons below.

* The languages are different so the code is literally implemented twice
* The execution models are different
* The data structures are inconsistent
* The validation frameworks in use across your client and server have different capabilities

With two implementations of your validation rules, it is inevitable that the implementations will differ. Developers will forget to update both implementations when a bug is fixed or a new feature is implemented, and the rules will drift apart. Once they become inconsistent, unexpected data enters your system and you find yourself needing to modify your validation rules to accommodate corrupt data. Everything goes downhill from there.

## Elegance

With client-side and server-side validation implementations in place, there is still one remaining problem: our product owners and user experience designers want elegant user interactions. Subtle cues differentiating between valid and invalid states. Animations during async validation. Friendly messages that guide the user to correct validation errors while not slapping the user's wrist while they are still typing. And this all has to work for every validation rule defined on every type of form field.

In order to pull off an elegant user experience, it is crucial to separate the responsibilities of validation triggers and validation logic. User interface code should crisply define _when_ validation occurs and at what scope. Validation code should then perform that validation and _merely return results_ to be consumed by the UI. The UI code must not be aware of what validation is actually occurring and the validation code must not be aware of how validation is affecting the UI.

Your user experience designer will change their mind on what effects they expect to see in the UI. You must be able to change the validation triggers and rendering easily without worry of affecting the actual validation logic. Only through separation of responsibilities will you obtain the flexibility to safely change the interactions.

Elegant validation experiences must scale nicely with the size and complexity of your forms. To accomplish this, the validation framework must be stateless and functional. The UI rendering code must simply render the validation results and trigger validation executions. A validation framework cannot prescribe specific user interactions or rendering.

## About the Author

[Jeff Handley](https://twitter.com/jeffhandley) has spent years concentrating on what it takes to implement well-rounded validation experiences. Jeff has developed in-house validation frameworks across platforms including Classic ASP, Visual Basic, ASP.NET Web Forms, and WinForms. At Microsoft, Jeff was the lead developer of the validation features built into the .NET Framework's `System.ComponentModel.DataAnnotations` namespace. His work included `IValidatableObject`, `ValidationResult`, `ValidationContext`, and `Validator`, among other implementation details introduced in .NET 4.0. Those features delivered validation functionality into ASP.NET MVC, ASP.NET Web Forms, WCF RIA Services, Silverlight, and WPF.

During the development of the .NET Framework validation framework, Jeff [wrote extensively](http://jeffhandley.com/tags/RiaServicesValidation/default.aspx) about how the framework could be used in WCF RIA Services for client-side and server-side validation. His blog also includes posts about some of his other work in the [validation](http://jeffhandley.com/tags/Validation/default.aspx) problem space as well as work in [WPF](http://jeffhandley.com/tags/WPF/default.aspx), [ASP.NET](http://jeffhandley.com/tags/ASP.NET/default.aspx), the [Model-View-ViewModel pattern](http://jeffhandley.com/tags/Model-View-ViewModel/default.aspx) and more.

Jeff created Strickland while working on the Node/React/Redux/GraphQL platform at SAP Concur. There, Strickland is being used across multiple projects and multiple teams.

## The Name Strickland

When React was introduced, Flux was presented as a complementary design pattern. Many *Back to the Future* themed libraries emerged as implementations of Flux.

Principal Strickland was the rule-monger of Hill Valley High School in the *Back to the Future* movies.

A validation framework was needed that would integrate nicely with the React ecosystem. These ideas were combined and Strickland was born. Though v1.0.0 was not released until December 2017, initial work on Strickland began and the [strickland.io](https://strickland.io) domain was purchased in 2015, the same year that Marty visited in the future.
