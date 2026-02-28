---
title: Goob Station Reforged notes
description: Stuff ranging from documentation to ideas
---
# Goob Station Reforged

So, a few things that I'd like to note down lest I forget it:

## Communication between systems

For communication outside of goobmod, prefer abstract classes in common over event bus.

While it might seem prudent to use the tools that are in place, adding things to event bus unnecessarily strains it. It gets way worse once you have a lot of events. So what to use instead?

### ***Abstract systems in Common.***

The idea is simple. You define an `abstract` system in say, `Goobstation.Common`. Then, you provide an implementation in (for example) `Goobstation.Server`. Now, if you want to use something from a system, instead of sending over an event you just call it.

How? If you know anything about modules, packaging, etc. it's probably that there's dependencies, and you can't have circular ones. Current order (simplified) looks like this: `Goobstation.Common` is depended on by `Content.Server`, which in turn is a dependency of `Goobstation.Server`. As such, usually if you're in `Content.Server`, you can't really call methods from `Goobstation.Server`. You just have to send events all over the place, more specifically `[ByRef]` events.

But what if we wanted to just, not do that?

Thanks to the ~~horrible~~ wonderful IoC, dependency injections, etc. we can. Let's look at an example.

(It was adapted from [this](https://github.com/Goob-Station/Goob-Station/pull/5881) PR)

```csharp
namespace Content.Goobstation.Common.FancyStuff;

public abstract class FancyStuffSystem : EntitySystem
{
    public abstract EntityUid? FindFancyStuff(EntityUid something);
}
```

Pretty neat, huh?
