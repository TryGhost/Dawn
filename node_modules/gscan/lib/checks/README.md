
The gscan rule categories are coming from the need to make the failed checks more readable for the end user. They enable logical grouping and sensible order.

# TODO

In the gscan performance project (cycle 3, 2021), we had to integrate one AST rule and we did so under the category `090-template-syntax`. It's not correct, the category 090 should be deleted. The reason is that we don't want one category that contains all AST checks.

Instead we should make sure that AST rules can be run in any existing category like `020-theme-structure`. There is no appetite to make this change right now, it could be done in the future if we want to spend time on it.
