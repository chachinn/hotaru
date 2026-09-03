# Reviewed bootstrap freeze fix

The reviewed-team bootstrap must aggregate all reviewed team arrays and call `registerReviewedTeams()` once. Calling it once per character rebuilds the full reviewed-team indexes repeatedly and can monopolize the iOS/PWA main thread after the shell has already painted. Hotaru v48 advances the recovery worker/reload marker so installed v47 clients move onto the batched bootstrap.
