export default function ChangeTitle(actionContext, payload, done) {
    actionContext.validate(payload);
    actionContext.dispatch('UPDATE_PAGE_TITLE', { pageTitle: payload });
}
