let scheduledHide;
export const hideAlert = function () {
    const alertElement = document.querySelector('.alert');
    if (alertElement) {
        alertElement.parentElement?.removeChild(alertElement);
    }
};
export const showAlert = function (type, message) {
    if (scheduledHide) {
        clearTimeout(scheduledHide);
    }
    hideAlert();
    const markup = `<div class="alert alert--${type}">${message}</div>`;
    document.querySelector('body')?.insertAdjacentHTML('afterbegin', markup);
    scheduledHide = setTimeout(() => {
        hideAlert();
    }, 1500);
};
export const errorCatcher = async function (func, ...argsInput) {
    try {
        showAlert('success', 'Please wait...');
        return await func(...argsInput);
    }
    catch (error) {
        showAlert('error', error.message);
    }
};
