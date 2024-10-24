package {{ .Scaffold.package1 }}.{{ .Scaffold.package2 }};

import net.fabricmc.api.ModInitializer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class {{ .ProjectPascal }} implements ModInitializer {
	public static final String MOD_ID = "{{ .ProjectKebab }}";
	public static final Logger LOGGER = LoggerFactory.getLogger(MOD_ID);

	@Override
	public void onInitialize() {
		LOGGER.info("hello from {{ toLower .Project }}!");
	}
}
