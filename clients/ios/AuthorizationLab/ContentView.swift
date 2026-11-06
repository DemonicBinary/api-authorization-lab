import SwiftUI
import Foundation

// An educational iOS Simulator app. It intentionally talks only to the
// developer's local synthetic API on 127.0.0.1. No real credentials or data.
struct ContentView: View {
    @State private var identity = "alice"
    @State private var document = "doc-202"
    @State private var handler = "guarded"
    @State private var response = "Start the local Node server, then try a request."
    @State private var loading = false

    private let identities = ["alice", "bob", "admin", "none"]
    private let documents = ["doc-101", "doc-202", "doc-103"]

    var body: some View {
        NavigationStack {
            Form {
                Section("Synthetic request") {
                    Picker("Principal", selection: $identity) {
                        ForEach(identities, id: \.self) { Text($0) }
                    }
                    Picker("Document", selection: $document) {
                        ForEach(documents, id: \.self) { Text($0) }
                    }
                    Picker("Handler", selection: $handler) {
                        Text("Guarded policy").tag("guarded")
                        Text("Intentionally vulnerable").tag("vulnerable")
                    }
                    Button(loading ? "Requesting..." : "Run local request") {
                        Task { await runRequest() }
                    }.disabled(loading)
                }
                Section("HTTP response") {
                    Text(response).font(.system(.footnote, design: .monospaced))
                        .textSelection(.enabled)
                }
                Section("About the trust boundary") {
                    Text("Identity alone does not authorize a document. Compare the guarded and vulnerable handlers using the same synthetic principal and object.")
                    Text("Development demonstration only. Never expose the vulnerable endpoint or use these demo tokens in a real system.")
                        .foregroundStyle(.secondary)
                }
            }
            .navigationTitle("Authorization Lab")
        }
    }

    @MainActor
    private func runRequest() async {
        loading = true
        defer { loading = false }
        guard let url = URL(string: "http://127.0.0.1:8765/\(handler)/documents/\(document)") else {
            response = "Invalid local lab URL"
            return
        }
        var request = URLRequest(url: url)
        request.timeoutInterval = 4
        if identity != "none" {
            request.setValue("Bearer demo-\(identity)", forHTTPHeaderField: "Authorization")
        }
        do {
            let (data, result) = try await URLSession.shared.data(for: request)
            let code = (result as? HTTPURLResponse)?.statusCode ?? 0
            response = "HTTP \(code)\n\n" + (String(data: data, encoding: .utf8) ?? "(non-text response)")
        } catch {
            response = "Local request failed: \(error.localizedDescription)\n\nRun npm start first. The server binds to 127.0.0.1."
        }
    }
}
