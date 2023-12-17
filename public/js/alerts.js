let scheduledHide;
export const hideAlert = function () {
    const alertElement = document.querySelector('.alert');
    if (alertElement) {
        alertElement.parentElement?.removeChild(alertElement);
    }
};
export const showAlert = function (type, message, time = 1.5) {
    if (scheduledHide) {
        clearTimeout(scheduledHide);
    }
    hideAlert();
    const markup = `<div class="alert alert--${type}">${message}</div>`;
    document.querySelector('body')?.insertAdjacentHTML('afterbegin', markup);
    scheduledHide = setTimeout(() => {
        hideAlert();
    }, time * 1000);
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
