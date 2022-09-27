const logOutHandle = async () => {
    const response = await fetch('/api/users/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });
    if (response.ok) {
        document.location.replace('/');
    } else {
        alert(response.statusText);
    }
}

document.querySelectorAll('.logout-btn').forEach($btn => $btn.addEventListener('click', logOutHandle));