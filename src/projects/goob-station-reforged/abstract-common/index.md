---
title: Communication Between Systems
description: For communication outside of goobmod, prefer abstract classes in
  common over event bus.
type: page
---

# Communication Between Systems

For communication outside of goobmod, prefer abstract classes in common over event bus.

While it might seem prudent to use the tools that are in place, adding things to event bus unnecessarily strains it. It gets way worse once you have a lot of events. So what to use instead?

### **_Abstract systems in Common_**

The idea is simple. You define an `abstract` system in say, `Goobstation.Common`. Then, you provide an implementation in (for example) `Goobstation.Server`. Now, if you want to use something from a system, instead of sending over an event you just call it.

How? If you know anything about modules, packaging, etc. it's probably that there's dependencies, and you can't have circular ones. Current order (simplified) looks like this: `Goobstation.Common` is depended on by `Content.Server`, which in turn is a dependency of `Goobstation.Server`. As such, usually if you're in `Content.Server`, you can't really call methods from `Goobstation.Server`. You just have to send events all over the place, more specifically `[ByRef]` events.

But what if we wanted to just, not do that?

Thanks to the ~~horrible~~ wonderful IoC, dependency injections, etc. we can. Let's look at an example.

(It was adapted from [this](https://github.com/Goob-Station/Goob-Station/pull/5881) PR)

```csharp
/// In Common module:
namespace Content.Goobstation.Common.FancyStuff;

public abstract class CommonFancyStuffSystem : EntitySystem
{
  public abstract EntityUid? FindFancyStuff(EntityUid something);
}

/// In Shared module
namespace Content.Goobstation.Shared.FancyStuff;

public sealed class FancyStuffSystem : CommonFancyStuffSystem
{
  public override EntityUid? FindFancyStuff(EntityUid something)
  {
    // some code
  }
}

/// In Shared core
using Content.Goobstation.Common.FancyStuff;
namespace Content.Shared.NotFancyStuff;
// ...
[Dependency] private readonly CommonFancyStuffSystem _fancyStuff = default!;
// ...
var location = _fancyStuff.FindFancyStuff(someEntity);
```

This lets us call things in Goob code _without_ having to send any events. We keep the bus clean, everyone is happy, the day is saved.
