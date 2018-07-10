## Fun Web OS

The Fun Web OS (a.k.a. Fun) provdies a (very) simple desktop environment which runs in your web browser.

The primary difference between Fun and other more feature complete web operating systems is that Fun is really only meant to host a single application, or a single set of interrelated applications.

### Usage

As perhaps you can imagine setting up an operating system is non-trivial. Fun integrates with [React](https://reactjs.org/)/[Redux](https://redux.js.org/) applications using [Redux Subspace](https://ioof-holdings.github.io/redux-subspace/). To guide users through getting Fun working I've created [fun-web-os-setup-example](https://github.com/conartist6/fun-web-os-setup-example). You should feel free to copy and modify it to get started, or it makes a great reference if you are integrating with an existing codebase.

### Features

- **Windows.** You can drag them around. You can close them. That's about it really.
- **Desktop.** Sits under windows. Desktop icons show up on the left.
- **Applications.** Currently applications cannot have more than one window of themselves open.
- **Files.** A file can be an application or data. Files only show up on the desktop at present.
- **Filetype Associations.** A mapping from file extensions (e.g. `.xyz`) to applications will choose which application to focus and update.

### Limitations

There is no filesystem in Fun -- it is a frontend only application. There are however great solutions to this limitation! You should configure your web server to serve directory indexes (for the files you want Fun to make accessible), make requests with the `Accept: text/json` header, then ensure that your web server resepects that header when serving the indexes.

File contents are not part of the system yet either. It is assumed that an application, given a filename, will know how to construct a request which will fetch that file's contents.

### Philosophy

Fun OS is a waste of space. Fun OS is meant to be a waste of space. If you need to waste space, you should do it in style! You should do it while having fun!

### Other

The official album of Fun Web OS is [I Like Fun](https://open.spotify.com/album/0NphwDR3zIVfULKcBDQ9Ap) by [They Might Be Giants](https://www.theymightbegiants.com/).
