package {{ .Scaffold.package1 }}.{{ .Scaffold.package2 }};

import net.fabricmc.api.ClientModInitializer;

public class {{ .ProjectPascal }}Client implements ClientModInitializer {
	@Override
	public void onInitializeClient() {}
}
