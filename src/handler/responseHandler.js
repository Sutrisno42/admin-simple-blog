export default function (payload) {
    let code = payload?.status ?? 500;
    let response = {
        code: code,
        message: payload?.data?.message ?? 'ok',
        result: payload?.data?.result ?? null,
        errors: payload?.data?.errors ?? null
    }

    if (code >= 400) {
        response.message = payload?.response?.data?.message ?? "Wrong username or password";
        response.data = payload?.response?.data?.data ?? null;
        response.errors = payload?.response?.data?.errors ?? payload?.response.data?.message;
        throw response
    }
    if (code >= 300) {
        response.message = payload?.response?.data?.message ?? "Error communicating with server...";
        response.data = payload?.response?.data?.data ?? null;
        response.errors = payload?.response?.data?.errors ?? payload?.response.data?.message;
        throw response
    }
    return response;
}